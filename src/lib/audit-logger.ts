import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AuditLogEntry {
    userId: string;
    eventType: string;
    resourceType: string;
    resourceId: string;
    description: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
}

export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
    try {
        await supabase.from('audit_logs').insert({
            user_id: entry.userId,
            event_type: entry.eventType,
            event_category: getEventCategory(entry.eventType),
            resource_type: entry.resourceType,
            resource_id: entry.resourceId,
            description: entry.description,
            metadata: entry.metadata || {},
            ip_address: entry.ipAddress,
            user_agent: entry.userAgent
        });
    } catch (error) {
        console.error('[Audit Log] Failed to write:', error);
        // Don't throw - logging failure shouldn't break the main operation
    }
}

function getEventCategory(eventType: string): string {
    if (eventType.includes('created')) return 'success';
    if (eventType.includes('deleted')) return 'warning';
    if (eventType.includes('error') || eventType.includes('failed')) return 'error';
    return 'info';
}

export function maskApiKey(key: string): string {
    if (key.length <= 11) return key;
    return `${key.substring(0, 7)}...${key.slice(-4)}`;
}
