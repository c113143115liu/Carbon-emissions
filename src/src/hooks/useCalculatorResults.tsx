import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { Json } from '@/integrations/supabase/types';

export interface CalculatorResult {
  id: string;
  user_id: string;
  calculator_type: string;
  inputs: Json;
  result_kg: number;
  created_at: string;
}

export const useCalculatorResults = () => {
  const { user } = useSupabaseAuth();
  const [results, setResults] = useState<CalculatorResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [user]);

  const fetchResults = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('calculator_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching calculator results:', error);
    } else {
      setResults(data || []);
    }
    setLoading(false);
  };

  const saveResult = async (
    calculatorType: string,
    inputs: Json,
    resultKg: number
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('calculator_results')
      .insert({
        user_id: user.id,
        calculator_type: calculatorType,
        inputs,
        result_kg: resultKg
      })
      .select()
      .single();

    if (!error && data) {
      setResults(prev => [data, ...prev]);
    }
    return { data, error };
  };

  const getResultsByType = (calculatorType: string) => {
    return results.filter(r => r.calculator_type === calculatorType);
  };

  const getTotalEmissions = () => {
    return results.reduce((sum, r) => sum + r.result_kg, 0);
  };

  const getLatestResult = (calculatorType: string) => {
    return getResultsByType(calculatorType)[0];
  };

  return {
    results,
    loading,
    fetchResults,
    saveResult,
    getResultsByType,
    getTotalEmissions,
    getLatestResult
  };
};
