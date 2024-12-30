/* eslint-disable prettier/prettier */
import { SupabaseClient, Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { supabase } from "@/config/supabase"; // Importa il client Supabase



// Define the type for the context
interface SupabaseContextType {
  supabase: SupabaseClient;
  session: Session | null;
}

// Crea il contesto Supabase
const SupabaseContext = createContext<SupabaseContextType | null>(null);

// Provider che rende il client Supabase accessibile ai componenti


export const SupabaseProvider = ({ children }: { children: ReactNode }) => {

	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		// Controlla la sessione all'avvio e imposta il listener di autenticazione
		const checkSession = async () => {
			const { data } = await supabase.auth.getSession();
			setSession(data.session);

			const { data: authListener } = supabase.auth.onAuthStateChange(
				(event, session) => {
          setSession(session);
				},
			);

			return () => {
				authListener?.subscription.unsubscribe();
			};
		};

		checkSession();
	}, []);

	return (
		<SupabaseContext.Provider value={{ supabase, session }}>
			{children}
		</SupabaseContext.Provider>
	);
};

// Hook personalizzato per accedere al contesto Supabase
export const useSupabase = () => {
	const context = useContext(SupabaseContext);
	if (!context) {
		throw new Error(
			"useSupabase deve essere usato all’interno di un SupabaseProvider.",
		);
	}
	return context;
};
