'use client';
import {useEffect} from 'react';
import {initSite} from './site-client.mjs';
import {initCalculator} from './calculator-client.mjs';

export default function SiteInteractions({calculator = false}) {
  useEffect(() => {
    const cleanSite = initSite();
    const cleanCalculator = calculator ? initCalculator() : () => {};
    return () => {cleanCalculator(); cleanSite();};
  }, [calculator]);
  return null;
}
