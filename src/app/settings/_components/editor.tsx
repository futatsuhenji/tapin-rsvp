'use client';

import { useState } from 'react';

import type { JSX } from 'react';

type Props = {
    email: string;
    name: string;
    onProfileUpdate: (name: string) => Promise<void>;
};

export default function ProfileEditor({ email, name, onProfileUpdate }: Props): JSX.Element {
    const [nameInput, setNameInput] = useState<string | undefined>();
    const [isSaving, setIsSaving] = useState(false);
    return (
        <form
            onSubmit={async (event) => {
                event.preventDefault();
                setIsSaving(true);
                if (nameInput) {
                    await onProfileUpdate(nameInput);
                }
                setNameInput(undefined);
                setIsSaving(false);
                alert('変更を保存しました。'); // TODO: 置き換える
                globalThis.location.reload();
            }}
            className="space-y-6"
        >
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
                    <input
                        type="email"
                        value={email}
                        readOnly
                        className={[
                            'mt-1 w-full cursor-not-allowed rounded-md border border-gray-200',
                            'bg-gray-50 px-3 py-2',
                            'text-gray-700 shadow-sm',
                        ].join(' ')}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">表示名</label>
                    <input
                        type="text"
                        value={nameInput ?? name}
                        onChange={(event) => setNameInput(event.target.value)}
                        className={[
                            'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm',
                            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
                        ].join(' ')}
                        placeholder="例: 山田 太郎"
                    />
                    <p className="mt-1 text-xs text-gray-500">参加者一覧やメールに表示される名前です。</p>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={[
                            'inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm',
                            'font-semibold text-white shadow-sm transition',
                            'hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60',
                        ].join(' ')}
                    >
                        {isSaving ? '保存中…' : '変更を保存'}
                    </button>
                </div>
            </div>
        </form>
    );
}
