import { createClient } from '@/lib/supabase/server';

/**
 * Audit Event Types
 * Tracks all critical user actions for compliance and debugging
 */
export type AuditEventType =
    | 'api_key_created'
    | 'api_key_deleted'
    | 'api_key_renamed'
    | 'api_key_rotated'
    | 'usage_warning_50_percent'
    | 'usage_warning_80_percent'
    | 'usage_limit_reached'
    | 'usage_reset'
    | 'account_upgraded'
    | 'account_downgraded';

export type ResourceType = 'api_key' | 'usage_quota' | 'account' | 'system';

export type EventCategory = 'info' | 'warning' | 'critical';

/**
 * Log an audit event to the database
 * 
 * @param params - Event details
 * @returns Promise that resolves when event is logged
 */
export async function logAuditEvent({
    userId,
    eventType,
    resourceType,
    resourceId,
    description,
    metadata,
    ipAddress,
    userAgent,
}: {
    userId: string;
    eventType: AuditEventType;
    resourceType: ResourceType;
    resourceId?: string;
    description: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}): Promise<void> {
    try {
        const supabase = await createClient();

        // Determine event category based on event type
        const category: EventCategory = eventType.includes('warning')
            ? 'warning'
            : eventType.includes('limit_reached')
                ? 'critical'
                : 'info';

        const { error } = await supabase
            .from('audit_logs')
            .insert({
                user_id: userId,
                event_type: eventType,
                event_category: category,
                resource_type: resourceType,
                resource_id: resourceId,
                description,
                metadata: metadata || {},
                ip_address: ipAddress,
                user_agent: userAgent,
            });

        if (error) {
            console.error('[AUDIT LOG ERROR]', error);
            // Don't throw - logging failure shouldn't break the main operation
        }
    } catch (error) {
        console.error('[AUDIT LOG EXCEPTION]', error);
        // Silently fail - audit logging is important but not critical
    }
}

/**
 * Mask an API key for safe logging
 * Shows only the prefix (first 8 chars) and masks the rest
 * 
 * @param apiKey - Full API key (e.g., "ox_a3f8d9e2b4c1xyz9")
 * @returns Masked key (e.g., "ox_a3f8d9e2...****")
 */
export function maskApiKey(apiKey: string): string {
    if (!apiKey || apiKey.length < 12) {
        return '****';
    }

    const prefix = apiKey.substring(0, 12); // ox_ + first 8 hex chars
    return `${prefix}...****`;
}
