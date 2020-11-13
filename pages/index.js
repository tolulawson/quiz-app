import Link from 'next/link';
import Dexie from 'dexie';
import React from 'react';
import { useRouter } from 'next/router';

let db;

export default function Home() {
  return (
    <h1>Hello, world!</h1>
  )
}
