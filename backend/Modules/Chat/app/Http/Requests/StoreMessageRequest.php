<?php

namespace Modules\Chat\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'body' => ['nullable', 'string', 'max:5000'],
            'attachment' => [
                'nullable',
                'file',
                'max:5120',
                'mimetypes:image/jpeg,image/png,image/webp,image/gif,audio/mpeg,audio/mp4,audio/webm,audio/ogg,audio/wav,audio/x-m4a,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/zip',
            ],
        ];
    }
}
