'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SearchIcon, MapPinIcon, UsersIcon, BriefcaseIcon, Code2Icon, CalendarDaysIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import styles from './discovery.module.css';
import { MOCK_DEVS } from '@/domains/developers/mock-data';
import { MOCK_COMPANIES } from '@/lib/data/mock';

function DiscoveryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stackParam = searchParams.get('stack') || '';
  const cityParam = searchParams.get('cidade') || '';
  const availabilityParam = searchParams.get('disponibilidade') || '';

  const [stacks, setStacks] = useState<string[]>(stackParam ? [stackParam] : []);
  const [city, setCity] = useState(cityParam);
  const [availability, setAvailability] = useState(availabilityParam);

  const updateFilters = () => {
    const params = new URLSearchParams();
    if (stacks.length) stacks.forEach(s => params.append('stack', s));
    if (city) params.set('cidade', city);
    if (availability) params.set('disponibilidade', availability);
    router.replace(`/discovery${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const filteredDevs = MOCK_DEVS.filter(d => 
    (!stacks.length || stacks.some(s => d.skills?.includes(s))) &&
    (!city || d.city === city) &&
    (!availability || d.availability === availability)
  );

  const filteredCompanies = MOCK_COMPANIES.filter(c =>
    (!stacks.length || stacks.some(s => c.industry?.toLowerCase().includes(s.toLowerCase()))) &&
    (!city || c.location?.includes(city))
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Discovery Cross-Domain</h1>
      <p className={styles.subtitle}>Quem trabalha com {stacks.join(', ') || '...'} em {city || '...'}?</p>

      <div className={styles.filters}>
        <input
          placeholder="Stack (ex: React)"
          value={stacks[0] || ''}
          onChange={e => setStacks(e.target.value ? [e.target.value] : [])}
          className={styles.input}
        />
        <input
          placeholder="Cidade"
          value={city}
          onChange={e => setCity(e.target.value)}
          className={styles.input}
        />
        <select
          value={availability}
          onChange={e => setAvailability(e.target.value)}
          className={styles.select}
        >
          <option value="">Disponibilidade</option>
          <option value="aberto">Aberto</option>
          <option value="propostas">Propostas</option>
          <option value="ocupado">Ocupado</option>
        </select>
        <button onClick={updateFilters} className={styles.btn}>Buscar</button>
      </div>

      <div className={styles.results}>
        <section>
          <h2><UsersIcon /> Devs ({filteredDevs.length})</h2>
          {filteredDevs.map(d => (
            <div key={d.id} className={styles.card}>
              <Link href={`/devs/${d.username}`}>{d.full_name}</Link>
              <span>{d.city} • {d.skills?.join(', ')}</span>
            </div>
          ))}
        </section>

        <section>
          <h2><BriefcaseIcon /> Empresas ({filteredCompanies.length})</h2>
          {filteredCompanies.map(c => (
            <div key={c.id} className={styles.card}>
              <Link href={`/empresas/${c.id}`}>{c.name}</Link>
              <span>{c.location} • {c.industry}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default function DiscoveryPage() {
  return (
    <Suspense fallback={<div className={styles.container} />}>
      <DiscoveryContent />
    </Suspense>
  );
}
