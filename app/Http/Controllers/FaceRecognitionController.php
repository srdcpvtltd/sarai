<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Criminal;
use Illuminate\Http\Request;

class FaceRecognitionController extends Controller
{
    public function criminals(Request $request){

        $items = Criminal::select([
            'id',
            'name',
            'photo',
         ])
         ->orderBy('created_at','ASC')
         ->get();

        $items->map(function ($item, $key) {
            return $item->photo_url = url('storage/criminals/'.$item->photo);
        });
        $items->all();

        $data = $items->toArray();

        return response($data);
    }

    public function guests(Request $request){

        $booking = Booking::select([
            'id as id',
            'gues_name as name',
            'guest_image as photo'
         ])
         ->whereNull('suspicious')
         ->orderBy('created_at','DESC')
         ->first();

        $booking->photo_url = url('storage/bookings/'.$booking->photo);

        return response([$booking]);
    }

    public function saveBgCheckResults(Request $request){
        $data = $request->all();

        /*
        $data = [
            guest_id => 1231,
            suspiciuos => 1 or 0,
            criminal_id => 343 or null
        ];
        */

        $guest = Booking::where('id',$data['guest_id'])
        ->update([
            'suspicious' => $data['suspicious'] ?? 0,
            'criminal_id' => $data['criminal_id'] ?? null
        ]);

    }

}
