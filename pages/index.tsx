import Head from 'next/head'
import {useState} from "react";
import { Combobox } from '@headlessui/react';
import {CheckIcon, MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import useSWR from 'swr';

export interface Person  {
    id: number,
    name: string
}

const comparePeople = (a: Person, b: Person): boolean => a?.name.toLowerCase() === b?.name.toLowerCase();

function LoadingSpiner () {
    return (
        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg"
             fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                    strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    )
}

async function fetcher (url:string, query:string): Promise<Person[]> {
    const data = await fetch(`${url}?q=${query}`)

    return data.json();
}

export default function Home<NextPage>() {
    const [selectedPerson, setSelectedPerson] = useState<Person | undefined>(undefined)
    const [query, setQuery] = useState('')

    const {data: filteredPeople, error} = useSWR(['/api/person', query], fetcher)

    const isLoading = !error && !filteredPeople

    return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={'max-w-md mx-auto'}>
        <h1 className="text-3xl font-bold text-center">Combobox Example</h1>
          <div className={'focus-within:ring-2 focus-within:ring-blue-500 shadow-xl border-none'}>
              <Combobox value={selectedPerson} by={comparePeople} onChange={setSelectedPerson}>
                  <div className={'flex items-center bg-gray-100 px-3'}>
                      <MagnifyingGlassIcon className={'h-5 w-5 text-gray-500 inline-block '}/>
                      <Combobox.Input
                          onChange={(event) => setQuery(event.target.value)}
                          displayValue={(person: Person) => person?.name ?? ''}
                          className={'bg-gray-100 w-full py-2 px-3 outline-none'}
                          autoComplete={'off'}
                      />
                      {isLoading && <LoadingSpiner />}
                  </div>
                  <Combobox.Options>
                      {filteredPeople?.map((person) => (
                          <Combobox.Option
                              key={person.id}
                              value={person}
                              className="flex py-2 px-3 ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-gray-800"
                          >
                              <CheckIcon className="hidden ui-selected:block h-5 w-5 inline-block mr-2" />
                              {person.name}
                          </Combobox.Option>
                      ))}
                  </Combobox.Options>
              </Combobox>
          </div>
      </main>
    </div>
  )
}
