import { router } from '@inertiajs/react';
import f3 from 'family-chart';
import 'family-chart/styles/family-chart.css';
import '../../../css/family-chart-theme.css';
import { useEffect, useRef, useState } from 'react';
import PersonDetailsPanel from './PersonDetailsPanel';
import RemovePersonModal from './RemovePersonModal';
import { personFullName } from './utils';

// family-chart otherwise defaults to whichever person happens to be
// first in the array (usually whoever the user added first, i.e.
// themselves) — find the eldest ancestor instead so the tree opens
// showing the top of the family.
function findTopLevelId(people) {
    const root = people.find((p) => !p.rels?.father && !p.rels?.mother);
    return root?.id ?? null;
}

/**
 * Renders the family tree with family-chart.js (lines, layout, drag/zoom,
 * and the add/edit/delete relationship engine all come from the library).
 * Viewing, adding and removing people are our own React modules on top:
 * a card click only opens the read-only PersonDetailsPanel, and Edit /
 * Add relative / Remove are explicit actions from there instead of the
 * library's own auto-opening sidebar.
 */
export default function FamilyTree({ data, readOnly = false }) {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const editTreeRef = useRef(null);

    const [selectedPerson, setSelectedPerson] = useState(null);
    const [personToRemove, setPersonToRemove] = useState(null);

    useEffect(() => {
        if (!containerRef.current) return undefined;

        const cont = containerRef.current;
        cont.innerHTML = '';

        // Deferred a frame so the container has its final layout size before
        // family-chart measures it to center the initial tree — on a cold
        // page load the container can otherwise still be mid-layout here.
        const frame = requestAnimationFrame(() => setUpChart());

        function setUpChart() {
            const chart = f3
                .createChart(cont, structuredClone(data))
                .setTransitionTime(600)
                .setCardXSpacing(280)
                .setCardYSpacing(150)
                .setSingleParentEmptyCard(true, { label: 'Unknown' })
                .setOrientationVertical();

            const card = chart
                .setCard(f3.CardHtml)
                .setCardDisplay([['first name', 'last name'], ['birthday']])
                .setStyle('imageRect')
                .setOnHoverPathToMain();

            // Read-only mode skips the edit engine entirely — there's
            // nothing to add/edit/remove, so a card click always just
            // opens the details panel.
            const editTree = readOnly
                ? null
                : chart
                      .editTree()
                      .absolute()
                      .setFields([
                          { type: 'text', label: 'First name', id: 'first name' },
                          { type: 'text', label: 'Last name', id: 'last name' },
                          {
                              type: 'select',
                              label: 'Gender',
                              id: 'gender',
                              options: [
                                  { value: 'M', label: 'Male' },
                                  { value: 'F', label: 'Female' },
                                  { value: 'O', label: 'Other' },
                              ],
                          },
                          { type: 'text', label: 'Birthday', id: 'birthday' },
                          { type: 'text', label: 'Death date', id: 'deathday' },
                          { type: 'text', label: 'Photo URL', id: 'avatar' },
                      ])
                      .setEditFirst(true)
                      // When adding a relative, lets the form link to an
                      // already-existing person instead of always creating
                      // a new one — e.g. marrying someone already in the
                      // tree as a second spouse.
                      .setLinkExistingRelConfig({
                          label: 'Link an existing person',
                          linkRelLabel: (d) => {
                              const name = personFullName(d.data);
                              return d.data.birthday ? `${name} (${d.data.birthday})` : name;
                          },
                      })
                      .setOnChange(() => {
                          router.put(
                              route('tree.sync'),
                              { people: editTree.getStoreDataCopy() },
                              { preserveScroll: true, preserveState: true },
                          );
                      });

            card.setOnCardClick((e, d) => {
                // While adding/removing a relative, family-chart shows ghost
                // cards on the tree itself — let its own engine handle the
                // click instead of opening our details panel.
                if (editTree && (editTree.isAddingRelative() || editTree.isRemovingRelative())) {
                    editTree.open(d.data);
                    return;
                }

                card.onCardClickDefault(e, d);
                setSelectedPerson(d.data);
            });

            chartRef.current = chart;
            editTreeRef.current = editTree;

            const topLevelId = findTopLevelId(data);
            if (topLevelId) chart.store.updateMainId(topLevelId);

            chart.updateTree({ initial: true });
            setSelectedPerson(chart.getMainDatum() ?? null);
        }

        return () => {
            cancelAnimationFrame(frame);
            cont.innerHTML = '';
            chartRef.current = null;
            editTreeRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function relativesOf(person) {
        const chart = chartRef.current;
        if (!chart || !person) return [];

        const rels = person.rels || {};
        const list = [];
        const push = (id, label) => {
            if (!id) return;
            const datum = chart.store.getDatum(id);
            if (!datum) return;
            list.push({ id: `${label}-${id}`, label, name: personFullName(datum.data) });
        };

        push(rels.father, 'Father');
        push(rels.mother, 'Mother');
        (rels.spouses || []).forEach((id) => push(id, 'Spouse'));
        (rels.children || []).forEach((id) => push(id, 'Child'));

        return list;
    }

    function handleEdit(person) {
        setSelectedPerson(null);
        const datum = chartRef.current.store.getDatum(person.id);
        editTreeRef.current.open(datum);
    }

    function handleAddRelative(person) {
        setSelectedPerson(null);
        const datum = chartRef.current.store.getDatum(person.id);
        editTreeRef.current.addRelative(datum);
    }

    function handleRemoveConfirmed() {
        const chart = chartRef.current;
        const editTree = editTreeRef.current;
        const datum = chart.store.getDatum(personToRemove.id);

        if (datum) {
            f3.handlers.deletePerson(datum, chart.store.getData());
            chart.store.getLastAvailableMainDatum();
            chart.updateTree({});
            editTree.updateHistory();
        }

        setPersonToRemove(null);
        setSelectedPerson(null);
    }

    return (
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                        Family tree
                    </h3>
                    <p className="text-xs text-gray-500">
                        {readOnly
                            ? 'Click a card to see details.'
                            : 'Click a card to see details, add relatives, or remove someone.'}
                    </p>
                </div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                    {data.length} {data.length === 1 ? 'person' : 'people'}
                </span>
            </div>

            <div ref={containerRef} className="f3 h-[75vh] w-full bg-gray-50" />

            <PersonDetailsPanel
                person={selectedPerson}
                relatives={relativesOf(selectedPerson)}
                readOnly={readOnly}
                onClose={() => setSelectedPerson(null)}
                onEdit={handleEdit}
                onAddRelative={handleAddRelative}
                onRemove={setPersonToRemove}
            />

            {!readOnly && (
                <RemovePersonModal
                    person={personToRemove}
                    onCancel={() => setPersonToRemove(null)}
                    onConfirm={handleRemoveConfirmed}
                />
            )}
        </div>
    );
}
