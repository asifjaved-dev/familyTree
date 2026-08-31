<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Person extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'data',
        'rels',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
            'rels' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The shape family-chart.js expects for a single tree node.
     */
    public function toTreeNode(): array
    {
        return [
            'id' => $this->id,
            'data' => $this->data,
            'rels' => $this->rels,
        ];
    }
}
