import "@testing-library/jest-dom";

jest.mock("react-i18next", () => ({
	__esModule: true,
	initReactI18next: { type: "3rdParty", init: () => undefined },
	useTranslation: () => ({
		t: (key: string, params?: Record<string, unknown>) =>
			params && typeof params.count !== "undefined"
				? `${key}:${params.count as number}`
				: key,
		i18n: { changeLanguage: () => Promise.resolve() },
	}),
	Trans: ({ children }: { children: unknown }) => children,
}));

if (typeof window !== "undefined" && !window.matchMedia) {
	window.matchMedia = (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => undefined,
		removeListener: () => undefined,
		addEventListener: () => undefined,
		removeEventListener: () => undefined,
		dispatchEvent: () => false,
	});
}

