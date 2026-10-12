// SPDX-FileCopyrightText: 2026 KATO Hayate <dev@hayatek.jp>
// SPDX-License-Identifier: AGPL-3.0-only

import Link from 'next/link';

import { Prisma } from '@/generated/prisma/client';

import { getPrismaClient } from '@/lib/prisma';
import { getJwtFromCookieStore } from '@/utils/auth';

import type { JSX } from 'react';
import { notFound } from 'next/navigation';

type EventListItem = {
    id: string;
    name: string;
    description: string | null;
    place: string | null;
    startsAt: string | null;
    endsAt: string | null;
    registrationEndsAt: string | null;
    canManage: boolean;
};

function formatDateRange(startsAt: string | null, endsAt: string | null): string {
    if (!startsAt && !endsAt) return '未定';
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const format = (value: string) =>
        new Intl.DateTimeFormat('ja-JP', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(value));
    if (startsAt && endsAt) return `${format(startsAt)} 〜 ${format(endsAt)}`;
    if (startsAt) return `${format(startsAt)} 開始`;
    return `${format(endsAt!)} 終了`; // endsAtのみ
}

export default async function EventListPage({ params }: { params: Promise<{ groupId: string }> }): Promise<JSX.Element> {
    const { groupId } = await params;

    const prisma = await getPrismaClient();
    const jwt = await getJwtFromCookieStore();

    if (!jwt) notFound();
    const userId = jwt.user.id;

    // グループオーナー / 管理者確認
    const group = await prisma.eventGroup.findUnique({
        where: { id: groupId },
        select: { ownerId: true },
    });

    if (!group) notFound();

    const isGroupOwner = group.ownerId === userId;
    const isGroupAdmin = await prisma.eventGroupAdministrator.findUnique({
        where: { groupId_userId: { groupId, userId } },
        select: { userId: true },
    });

    const whereCondition: Prisma.EventWhereInput = { groupId };

    // グループオーナー or グループ管理者は全件
    if (!isGroupOwner && !isGroupAdmin) {
        whereCondition.OR = [
            { ownerId: userId },
            { administrators: { some: { userId } } },
            { attendances: { some: { userId } } },
        ];
    }

    const events: EventListItem[] = (await prisma.event.findMany({
        where: whereCondition,
        orderBy: { startsAt: 'asc' },
        select: {
            id: true,
            name: true,
            description: true,
            place: true,
            startsAt: true,
            endsAt: true,
            registrationEndsAt: true,
            ownerId: true,
            administrators: { select: { userId: true } },
        },
    // eslint-disable-next-line unicorn/no-await-expression-member
    })).map((event) => {
        const canManage =
            event.ownerId === userId || event.administrators.some((admin) => admin.userId === userId) || !!isGroupAdmin;
        return {
            ...event,
            canManage,
            administrators: undefined,
        } as unknown as { id: string; name: string; description: string | null; place: string | null; startsAt: string | null; endsAt: string | null; registrationEndsAt: string | null; ownerId: string; canManage: boolean };
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
                <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500">イベント一覧</p>
                        <h1 className="text-3xl font-semibold text-gray-900">グループのイベント</h1>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/mypage"
                            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300"
                        >
                            マイページへ
                        </Link>
                        <Link
                            href={`/group/${groupId}/manage`}
                            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300"
                        >
                            グループ管理へ
                        </Link>
                    </div>
                </header>

                {events.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">イベントがありません</div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {events.map((event) => (
                            <div key={event.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">{event.name}</h2>
                                        {event.description && (
                                            <p className="mt-1 text-sm text-gray-700 line-clamp-2">{event.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>日時: {formatDateRange(event.startsAt, event.endsAt)}</p>
                                    <p>場所: {event.place || '未設定'}</p>
                                    {event.registrationEndsAt && (
                                        <p>回答期限: {formatDateRange(event.registrationEndsAt, null)}</p>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href={`/event/${groupId}/${event.id}`}
                                        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300"
                                    >
                                        詳細へ
                                    </Link>
                                    {event.canManage && (
                                        <Link
                                            href={`/event/${groupId}/${event.id}/manage`}
                                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                        >
                                            管理ダッシュボード
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
