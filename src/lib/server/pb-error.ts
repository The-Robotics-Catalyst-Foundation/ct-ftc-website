// PocketBase's ClientResponseError carries per-field validation details in
// err.response.data (e.g. { email: { code: 'validation_not_unique', message: '...' } })
// that err.message alone doesn't surface - this pulls them out so admins see
// the actual reason a create/update failed instead of a generic message.
export function pbErrorMessage(err: any, fallback: string): string {
	const data = err?.response?.data;
	if (data && typeof data === 'object') {
		const fieldMessages = Object.entries(data)
			.map(([field, info]: [string, any]) => (info?.message ? `${field}: ${info.message}` : null))
			.filter((msg): msg is string => !!msg);
		if (fieldMessages.length) return fieldMessages.join(' ');
	}
	return err?.message ?? fallback;
}
