/**
 * Este arquivo configura o cliente de API e provedor React Query
 * Feito para simplificar a integração do site-edunexia com o monorepo
 */
import { QueryClient } from '@tanstack/react-query';
import { ApiClient } from '@edunexia/api-client/src/client';
export declare const apiClient: ApiClient;
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<import("@edunexia/database-schema/index").Database, "public", any>;
export declare function createQueryClient(): QueryClient;
//# sourceMappingURL=apiClient.d.ts.map