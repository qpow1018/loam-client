'use client';

import { useState } from 'react';

import Header from '@/components/common/header/Header';
import LoadoTable, { type TCharacter, type TMission } from './_component/LoadoTable';

import styles from './loadoClient.module.scss';

export default function LoadoClient() {
  const [characters, setCharacters] = useState<TCharacter[]>([
    { id: 'c1', nickname: '캐릭터1' },
    { id: 'c2', nickname: '캐릭터2' },
    { id: 'c3', nickname: '캐릭터3' },
  ]);
  const [missions, setMissions] = useState<TMission[]>([
    { id: 'm1', title: '카오스 던전' },
    { id: 'm2', title: '가디언 토벌' },
    { id: 'm3', title: '에포나 의뢰' },
  ]);

  return (
    <>
      <Header />

      <div className={styles['loado-client']}>
        <LoadoTable
          characters={characters}
          missions={missions}
          onReorderCharacters={setCharacters}
          onReorderMissions={setMissions}
        />
      </div>
    </>
  );
}
