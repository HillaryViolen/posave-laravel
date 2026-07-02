<?php

namespace App\Models\Advance\Owner\Employee;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Employee extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'branch',
        'active_date',
        'slot_status'
    ];

    public function access()
    {
        return $this->belongsTo(\App\Models\Advance\Owner\Branch::class);
    }

}
