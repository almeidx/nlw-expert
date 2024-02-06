import type { Config } from "tailwindcss";

export default {
	content: ["./index.html", "./src/**/*.tsx"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "sans-serif"],
			},
		},
	},
	plugins: [],
} satisfies Config;
