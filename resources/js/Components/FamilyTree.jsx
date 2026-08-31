import { router } from '@inertiajs/react';
import f3 from 'family-chart';
import 'family-chart/styles/family-chart.css';
import { useEffect, useRef } from 'react';

/**
 * Renders an editable family tree with family-chart.js.
 *
 * family-chart.js owns the tree state client-side (add/edit/remove relative
 * forms are all built in). Every time the user changes something we hand
 * the whole current dataset back to Laravel, which upserts what's present
 * and deletes what's gone — see PersonController::sync().
 */
export default function FamilyTree({ data }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return undefined;

        const cont = containerRef.current;
        cont.innerHTML = '';

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

        const editTree = chart
            .editTree()
            .fixed()
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
            .setOnChange(() => {
                router.put(
                    route('tree.sync'),
                    { people: editTree.getStoreDataCopy() },
                    { preserveScroll: true, preserveState: true },
                );
            })
            .setCardClickOpen(card);

        chart.updateTree({ initial: true });
        editTree.openFormWithId(chart.getMainDatum()?.id);

        return () => {
            cont.innerHTML = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={containerRef} className="f3 h-[75vh] w-full rounded-lg border border-gray-200 bg-white" />;
}
