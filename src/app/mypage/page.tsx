// SPDX-FileCopyrightText: 2026 KATO Hayate <dev@hayatek.jp>
// SPDX-FileCopyrightText: 2026 Yu Yokoyama <25w6105e@shinshu-u.ac.jp>
// SPDX-License-Identifier: AGPL-3.0-only

import Link from 'next/link';

import { getPrismaClient } from '@/lib/prisma';
import { getJwtFromCookieStore } from '@/utils/auth';
import { forbidden } from 'next/navigation';

export const dynamic = 'force-dynamic';

type GroupItem = {
    id: string;
    name: string;
    description: string | null;
    ownerId: string;
    canManage: boolean;
};

export default async function MyPage() {
    const prisma = await getPrismaClient();
    const jwt = await getJwtFromCookieStore();
    if (!jwt) {
        forbidden();
    }
    const userId = jwt.user.id;
    const groups: GroupItem[] = (await prisma.eventGroup.findMany({
        where: {
            OR: [
                { ownerId: userId },
                {
                    administrators: {
                        some: { userId },
                    },
                },
                {
                    events: {
                        some: {
                            attendances: {
                                some: { userId: userId },
                            },
                        },
                    },
                },
            ],
        },
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            id: true,
            name: true,
            description: true,
            ownerId: true,
            administrators: { select: { userId: true } },
        },
    // eslint-disable-next-line unicorn/no-await-expression-member
    })).map((group) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        ownerId: group.ownerId,
        canManage: group.ownerId === userId || group.administrators.some((admin) => admin.userId === userId),
    }));
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
                <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500">マイページ</p>
                        <h1 className="text-3xl font-semibold text-gray-900">参加したグループ</h1>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/settings"
                            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300"
                        >
                            設定
                        </Link>
                        <Link
                            href="/group/new"
                            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            グループを作成
                        </Link>
                    </div>
                </header>

                {groups.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">参加済みのグループがありません</div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {groups.map((group) => (
                            <div key={group.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">{group.name}</h2>
                                        {group.description && <p className="mt-1 text-sm text-gray-700 line-clamp-2">{group.description}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href={`/event/${group.id}`}
                                        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300"
                                    >
                                        イベント一覧
                                    </Link>
                                    {group.canManage && (
                                        <Link
                                            href={`/group/${group.id}/manage`}
                                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                        >
                                            グループ管理
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
