"use client";

import { useState } from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(() => supabase);

  return (
    <SessionContextProvider supabaseClient={client}>
      {children}
    </SessionContextProvider>
  );
}
