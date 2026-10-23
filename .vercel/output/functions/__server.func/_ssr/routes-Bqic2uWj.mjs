import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as History, i as Minus, n as SlidersHorizontal, o as Delete, r as Plus, s as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bqic2uWj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NowContext = (0, import_react.createContext)(0);
function NowProvider({ children }) {
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NowContext.Provider, {
		value: now,
		children
	});
}
function useNow() {
	return (0, import_react.useContext)(NowContext);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var DEFAULT_SETTINGS = {
	clubName: "Bilyard klub",
	rate: 6e4,
	vipRate: 12e4,
	tableCount: 9,
	vipTables: [8, 9],
	roundUp: 1
};
var DEFAULT_MENU = [
	{
		id: "suv",
		name: "Suv",
		price: 5e3,
		category: "ichimlik"
	},
	{
		id: "cola",
		name: "Cola",
		price: 12e3,
		category: "ichimlik"
	},
	{
		id: "fanta",
		name: "Fanta",
		price: 12e3,
		category: "ichimlik"
	},
	{
		id: "limonad",
		name: "Limonad",
		price: 14e3,
		category: "ichimlik"
	},
	{
		id: "energetik",
		name: "Energetik",
		price: 18e3,
		category: "ichimlik"
	},
	{
		id: "choy",
		name: "Choy",
		price: 8e3,
		category: "issiq"
	},
	{
		id: "qahva",
		name: "Qahva",
		price: 15e3,
		category: "issiq"
	},
	{
		id: "kapuchino",
		name: "Kapuchino",
		price: 2e4,
		category: "issiq"
	},
	{
		id: "pivo",
		name: "Pivo",
		price: 18e3,
		category: "pivo"
	},
	{
		id: "pivo-l",
		name: "Pivo 0.5",
		price: 25e3,
		category: "pivo"
	},
	{
		id: "chips",
		name: "Chips",
		price: 12e3,
		category: "gazak"
	},
	{
		id: "pista",
		name: "Pista",
		price: 3e4,
		category: "gazak"
	},
	{
		id: "shokolad",
		name: "Shokolad",
		price: 1e4,
		category: "gazak"
	},
	{
		id: "yongoq",
		name: "Yong'oq",
		price: 2e4,
		category: "gazak"
	}
];
var CATEGORIES = [
	{
		id: "all",
		label: "Hammasi"
	},
	{
		id: "ichimlik",
		label: "Ichimlik"
	},
	{
		id: "issiq",
		label: "Issiq"
	},
	{
		id: "pivo",
		label: "Pivo"
	},
	{
		id: "gazak",
		label: "Gazak"
	}
];
var TASHKENT = "Asia/Tashkent";
function uid() {
	return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
function formatSom(value) {
	const n = Math.round(value);
	return (n < 0 ? "−" : "") + Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\xA0");
}
function formatClock(ms) {
	const total = Math.max(0, Math.floor(ms / 1e3));
	const h = Math.floor(total / 3600);
	const m = Math.floor(total % 3600 / 60);
	const s = total % 60;
	const p = (n) => String(n).padStart(2, "0");
	return h > 0 ? `${h}:${p(m)}:${p(s)}` : `${p(m)}:${p(s)}`;
}
function formatWhen(ts) {
	return new Intl.DateTimeFormat("uz-UZ", {
		timeZone: TASHKENT,
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	}).format(new Date(ts));
}
function tashkentDay(ts) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: TASHKENT,
		year: "numeric",
		month: "2-digit",
		day: "numeric"
	}).format(new Date(ts));
}
function elapsedMs(s, now) {
	const live = s.pauseStartedAt ? Math.max(0, now - s.pauseStartedAt) : 0;
	return Math.max(0, now - s.startedAt - s.pausedMs - live);
}
function billedMinutes(elapsed, roundUp) {
	if (elapsed <= 0) return 0;
	const minutes = elapsed / 6e4;
	if (roundUp <= 1) return Math.ceil(minutes);
	return Math.ceil(minutes / roundUp) * roundUp;
}
function sessionLabel(s, walkinCount = 1) {
	if (s.kind === "table") return `Stol ${s.table}`;
	if (walkinCount > 1) return `Tashqi ${s.seq}`;
	return "Tashqi";
}
function quote(s, now, roundUp) {
	const elapsed = elapsedMs(s, now);
	const minutes = s.kind === "walkin" ? 0 : billedMinutes(elapsed, roundUp);
	const time = s.kind === "walkin" ? 0 : Math.round(s.ratePerHour * minutes / 60);
	const bar = s.items.reduce((sum, item) => sum + item.price * item.qty, 0);
	const gross = time + bar;
	const discountAmt = Math.min(gross, Math.round(gross * s.discountPct / 100));
	return {
		elapsed,
		minutes,
		time,
		bar,
		discountAmt,
		total: gross - discountAmt
	};
}
function displayBucket(text) {
	const len = text.replace(/\s/g, "").length;
	if (len <= 6) return "s";
	if (len <= 8) return "m";
	return "l";
}
function itemQty(items, menuId) {
	return items.find((item) => item.menuId === menuId)?.qty ?? 0;
}
function needFocus() {
	toast("Avval stolni yoki tashqini tanlang");
}
function walkinCount(sessions) {
	return sessions.filter((s) => s.kind === "walkin").length;
}
var useClub = create()(persist((set, get) => {
	const focused = () => get().sessions.find((s) => s.id === get().focusId) ?? null;
	const pushUndo = (session, undo) => [...undo, {
		type: "restore",
		session: structuredClone(session)
	}].slice(-30);
	const pushDelete = (undo, id) => {
		return [...undo, {
			type: "delete",
			id
		}].slice(-30);
	};
	const replaceSession = (next, snapshot) => {
		const st = get();
		set({
			undo: pushUndo(snapshot, st.undo),
			sessions: st.sessions.map((s) => s.id === next.id ? next : s)
		});
	};
	const makeTable = (n) => {
		const { settings } = get();
		const vip = settings.vipTables.includes(n);
		return {
			id: uid(),
			kind: "table",
			table: n,
			seq: 0,
			startedAt: Date.now(),
			pausedMs: 0,
			pauseStartedAt: null,
			ratePerHour: vip ? settings.vipRate : settings.rate,
			vip,
			items: [],
			discountPct: 0
		};
	};
	const makeWalkin = () => {
		const st = get();
		return {
			id: uid(),
			kind: "walkin",
			table: null,
			seq: st.walkinSeq + 1,
			startedAt: Date.now(),
			pausedMs: 0,
			pauseStartedAt: null,
			ratePerHour: st.settings.rate,
			vip: false,
			items: [],
			discountPct: 0
		};
	};
	const openClose = () => {
		const id = get().focusId;
		if (!id) {
			needFocus();
			return;
		}
		const top = get().sheets.at(-1);
		if (top && (top.kind === "close" || top.kind === "split" || top.kind === "void")) return;
		get().pushSheet({
			kind: "close",
			sessionId: id
		});
	};
	const finish = (sessionId, voided, cash, card) => {
		const st = get();
		const session = st.sessions.find((s) => s.id === sessionId);
		if (!session) {
			set({ sheets: st.sheets.slice(0, -1) });
			return;
		}
		const now = Date.now();
		const q = quote(session, now, st.settings.roundUp);
		const bill = {
			id: uid(),
			kind: session.kind,
			table: session.table,
			seq: session.seq,
			label: sessionLabel(session, walkinCount(st.sessions)),
			startedAt: session.startedAt,
			closedAt: now,
			elapsedMs: q.elapsed,
			billedMinutes: q.minutes,
			ratePerHour: session.ratePerHour,
			vip: session.vip,
			items: session.items,
			discountPct: session.discountPct,
			timeCharge: q.time,
			barTotal: q.bar,
			discountAmt: q.discountAmt,
			total: q.total,
			cash: voided ? 0 : cash,
			card: voided ? 0 : card,
			voided
		};
		set({
			sessions: st.sessions.filter((s) => s.id !== session.id),
			bills: [bill, ...st.bills].slice(0, 300),
			focusId: null,
			entry: null,
			undo: [],
			sheets: [{
				id: uid(),
				kind: "receipt",
				billId: bill.id
			}]
		});
		toast(voided ? "Hisob bekor qilindi" : `Yopildi · ${formatSom(q.total)}`);
	};
	return {
		settings: DEFAULT_SETTINGS,
		menu: DEFAULT_MENU,
		sessions: [],
		bills: [],
		walkinSeq: 0,
		focusId: null,
		sheets: [],
		entry: null,
		undo: [],
		pressTable: (n) => {
			const st = get();
			if (st.entry) {
				get().pressDigit(String(n));
				return;
			}
			if (n > st.settings.tableCount) return;
			const existing = st.sessions.find((s) => s.kind === "table" && s.table === n);
			if (!existing) {
				const session = makeTable(n);
				set({
					sessions: [...st.sessions, session],
					focusId: session.id,
					undo: pushDelete(st.undo, session.id)
				});
				return;
			}
			set({ focusId: existing.id });
			openClose();
		},
		pressWalkin: () => {
			const st = get();
			if (st.entry) {
				get().pressDigit("0");
				return;
			}
			const open = st.sessions.filter((s) => s.kind === "walkin");
			if (open.length >= 2) {
				get().pushSheet({ kind: "walkins" });
				return;
			}
			if (open.length === 1) {
				set({ focusId: open[0].id });
				openClose();
				return;
			}
			const session = makeWalkin();
			set({
				sessions: [...st.sessions, session],
				walkinSeq: session.seq,
				focusId: session.id,
				undo: pushDelete(st.undo, session.id)
			});
		},
		pressAC: () => {
			const st = get();
			if (st.entry) {
				set({ entry: null });
				return;
			}
			if (st.sheets.length) {
				set({ sheets: st.sheets.slice(0, -1) });
				return;
			}
			set({ focusId: null });
		},
		pressUndo: () => {
			const st = get();
			if (st.entry) {
				const buffer = st.entry.buffer;
				set({ entry: { buffer: buffer.length <= 1 ? "0" : buffer.slice(0, -1) } });
				return;
			}
			const last = st.undo[st.undo.length - 1];
			if (!last) {
				toast("Bekor qilinadigan amal yo'q");
				return;
			}
			const undo = st.undo.slice(0, -1);
			if (last.type === "delete") {
				const victim = st.sessions.find((s) => s.id === last.id);
				set({
					undo,
					sessions: st.sessions.filter((s) => s.id !== last.id),
					focusId: st.focusId === last.id ? null : st.focusId,
					walkinSeq: victim?.kind === "walkin" && victim.seq === st.walkinSeq ? Math.max(0, st.walkinSeq - 1) : st.walkinSeq
				});
				return;
			}
			const exists = st.sessions.some((s) => s.id === last.session.id);
			set({
				undo,
				focusId: last.session.id,
				sessions: exists ? st.sessions.map((s) => s.id === last.session.id ? last.session : s) : [...st.sessions, last.session]
			});
		},
		pressBar: () => {
			const st = get();
			if (st.sheets.at(-1)?.kind === "bar") {
				set({ sheets: st.sheets.slice(0, -1) });
				return;
			}
			set({
				focusId: st.focusId ?? (st.sessions.length ? st.sessions[st.sessions.length - 1].id : null),
				entry: null,
				sheets: [...st.sheets, {
					id: uid(),
					kind: "bar"
				}]
			});
		},
		pressPause: () => {
			const session = focused();
			if (!session) {
				needFocus();
				return;
			}
			if (session.kind === "walkin") {
				toast("Tashqida vaqt yurmaydi");
				return;
			}
			const now = Date.now();
			const next = session.pauseStartedAt ? {
				...session,
				pausedMs: session.pausedMs + (now - session.pauseStartedAt),
				pauseStartedAt: null
			} : {
				...session,
				pauseStartedAt: now
			};
			replaceSession(next, session);
		},
		pressRemove: () => {
			const session = focused();
			if (!session) {
				needFocus();
				return;
			}
			if (session.items.length === 0) {
				toast("Olib tashlash uchun buyurtma yo'q");
				return;
			}
			const items = session.items.map((item) => ({ ...item }));
			const last = items[items.length - 1];
			if (last.qty > 1) last.qty -= 1;
			else items.pop();
			replaceSession({
				...session,
				items
			}, session);
		},
		pressAdd: () => {
			if (get().entry) {
				get().confirmEntry();
				return;
			}
			if (!focused()) {
				needFocus();
				return;
			}
			set({ entry: { buffer: "0" } });
		},
		pressDiscount: () => {
			if (get().entry) return;
			const session = focused();
			if (!session) {
				needFocus();
				return;
			}
			get().pushSheet({
				kind: "discount",
				sessionId: session.id
			});
		},
		pressTransfer: () => {
			if (get().entry) return;
			const session = focused();
			if (!session) {
				needFocus();
				return;
			}
			get().pushSheet({
				kind: "transfer",
				sessionId: session.id
			});
		},
		pressVip: () => {
			if (get().entry) {
				get().pressZeros();
				return;
			}
			const session = focused();
			if (!session) {
				needFocus();
				return;
			}
			if (session.kind === "walkin") {
				toast("Tashqi hisobda VIP yo'q");
				return;
			}
			const { settings } = get();
			const vip = !session.vip;
			replaceSession({
				...session,
				vip,
				ratePerHour: vip ? settings.vipRate : settings.rate
			}, session);
		},
		pressHisob: () => {
			if (get().entry) {
				get().confirmEntry();
				return;
			}
			openClose();
		},
		pressDigit: (d) => {
			const entry = get().entry;
			if (!entry) return;
			const next = entry.buffer === "0" ? d : entry.buffer + d;
			if (next.length > 7) return;
			set({ entry: { buffer: next } });
		},
		pressZeros: () => {
			const entry = get().entry;
			if (!entry || entry.buffer === "0") return;
			const next = entry.buffer + "000";
			if (next.length > 7) return;
			set({ entry: { buffer: next } });
		},
		confirmEntry: () => {
			const st = get();
			const session = focused();
			const amount = Number(st.entry?.buffer ?? "0");
			if (!session || !st.entry) return;
			if (!Number.isFinite(amount) || amount <= 0) {
				toast("Summa kiriting");
				return;
			}
			const line = {
				id: uid(),
				menuId: "custom",
				name: "Qo'shimcha",
				price: Math.round(amount),
				qty: 1
			};
			set({
				entry: null,
				undo: pushUndo(session, st.undo),
				sessions: st.sessions.map((s) => s.id === session.id ? {
					...s,
					items: [...s.items, line]
				} : s)
			});
		},
		pushSheet: (sheet) => {
			set((st) => ({
				entry: null,
				sheets: [...st.sheets, {
					...sheet,
					id: uid()
				}]
			}));
		},
		popSheet: () => set((st) => ({ sheets: st.sheets.slice(0, -1) })),
		focusSession: (id) => {
			if (!get().sessions.some((s) => s.id === id)) return;
			set({ focusId: id });
		},
		createWalkin: () => {
			const st = get();
			const session = makeWalkin();
			set({
				sessions: [...st.sessions, session],
				walkinSeq: session.seq,
				focusId: session.id,
				undo: pushDelete(st.undo, session.id)
			});
			return session.id;
		},
		addMenu: (menuId) => {
			const st = get();
			const session = focused();
			const menu = st.menu.find((item) => item.id === menuId);
			if (!session || !menu) {
				needFocus();
				return;
			}
			const items = session.items.some((item) => item.menuId === menuId) ? session.items.map((item) => item.menuId === menuId ? {
				...item,
				qty: item.qty + 1
			} : item) : [...session.items, {
				id: uid(),
				menuId,
				name: menu.name,
				price: menu.price,
				qty: 1
			}];
			replaceSession({
				...session,
				items
			}, session);
		},
		decMenu: (menuId) => {
			const session = focused();
			if (!session) return;
			const line = session.items.find((item) => item.menuId === menuId);
			if (!line) return;
			const items = line.qty <= 1 ? session.items.filter((item) => item.menuId !== menuId) : session.items.map((item) => item.menuId === menuId ? {
				...item,
				qty: item.qty - 1
			} : item);
			replaceSession({
				...session,
				items
			}, session);
		},
		setDiscount: (sessionId, pct) => {
			const st = get();
			const session = st.sessions.find((s) => s.id === sessionId);
			if (!session) return;
			const discountPct = Math.max(0, Math.min(100, Math.round(pct)));
			set({
				undo: pushUndo(session, st.undo),
				sessions: st.sessions.map((s) => s.id === session.id ? {
					...s,
					discountPct
				} : s),
				sheets: st.sheets.slice(0, -1)
			});
		},
		transferTo: (sessionId, table) => {
			const st = get();
			const session = st.sessions.find((s) => s.id === sessionId);
			if (!session) return;
			if (session.kind === "table" && session.table === table) return;
			if (st.sessions.some((s) => s.kind === "table" && s.table === table)) {
				toast("Bu stol band");
				return;
			}
			const vip = st.settings.vipTables.includes(table);
			const next = session.kind === "walkin" ? {
				...session,
				kind: "table",
				table,
				startedAt: Date.now(),
				pausedMs: 0,
				pauseStartedAt: null,
				vip,
				ratePerHour: vip ? st.settings.vipRate : st.settings.rate
			} : {
				...session,
				table
			};
			set({
				undo: pushUndo(session, st.undo),
				sessions: st.sessions.map((s) => s.id === session.id ? next : s),
				focusId: session.id,
				sheets: st.sheets.slice(0, -1)
			});
			toast(session.kind === "walkin" ? `Stol ${table} — vaqt boshlandi` : `Stol ${table} ga ko'chdi`);
		},
		closeBill: (sessionId, cash, card) => finish(sessionId, false, cash, card),
		voidBill: (sessionId) => finish(sessionId, true, 0, 0),
		patchSettings: (partial) => set((st) => ({ settings: {
			...st.settings,
			...partial
		} })),
		setTableCount: (count) => {
			if (get().sessions.some((s) => s.kind === "table" && s.table !== null && s.table > count)) {
				toast("Avval yuqori raqamli stolni yoping");
				return;
			}
			set((st) => ({ settings: {
				...st.settings,
				tableCount: count,
				vipTables: st.settings.vipTables.filter((n) => n <= count)
			} }));
		},
		toggleVipTable: (table) => set((st) => {
			const has = st.settings.vipTables.includes(table);
			return { settings: {
				...st.settings,
				vipTables: has ? st.settings.vipTables.filter((n) => n !== table) : [...st.settings.vipTables, table].sort((a, b) => a - b)
			} };
		}),
		setMenuPrice: (id, price) => set((st) => ({ menu: st.menu.map((item) => item.id === id ? {
			...item,
			price: Math.max(0, Math.round(price))
		} : item) })),
		setClubName: (name) => set((st) => ({ settings: {
			...st.settings,
			clubName: name.trim() || "Bilyard klub"
		} }))
	};
}, {
	name: "stol-club-v1",
	version: 1,
	partialize: (state) => ({
		settings: state.settings,
		menu: state.menu,
		sessions: state.sessions,
		bills: state.bills,
		walkinSeq: state.walkinSeq,
		focusId: state.focusId
	}),
	onRehydrateStorage: () => (state) => {
		if (!state) return;
		if (state.focusId && !state.sessions.some((s) => s.id === state.focusId)) state.focusId = null;
	}
}));
function SheetHost() {
	const sheets = useClub((s) => s.sheets);
	const pop = useClub((s) => s.popSheet);
	(0, import_react.useEffect)(() => {
		if (!sheets.length) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [sheets.length]);
	if (!sheets.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-bg/60",
			"aria-label": "Orqaga",
			onClick: pop
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none relative z-10 mx-auto h-full w-full max-w-md",
			children: sheets.map((sheet, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetFrame, {
				sheet,
				index,
				count: sheets.length
			}, sheet.id))
		})]
	});
}
function SheetFrame({ sheet, index, count }) {
	const top = index === count - 1;
	const depth = count - 1 - index;
	const [shown, setShown] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return true;
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches || !top;
	});
	(0, import_react.useEffect)(() => {
		if (!top || shown) return;
		const id = requestAnimationFrame(() => setShown(true));
		return () => cancelAnimationFrame(id);
	}, [shown, top]);
	const shift = top ? 0 : -16 * depth;
	const scale = top ? 1 : 1 - Math.min(depth, 3) * .045;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "sheet-panel sheet-move absolute inset-x-0 bottom-0 bg-sheet text-fg",
		style: {
			zIndex: index,
			transformOrigin: "bottom center",
			pointerEvents: top ? "auto" : "none",
			transform: shown || !top ? `translateY(${shift}px) scale(${scale})` : "translateY(110%)"
		},
		role: top ? "dialog" : void 0,
		"aria-modal": top ? true : void 0,
		"aria-hidden": !top,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
			sheet,
			stacked: count > 1 && top
		}), top ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "sheet-body",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetBody, { sheet })
		}) : null]
	});
}
function sheetTitle(sheet, sessions) {
	const session = "sessionId" in sheet ? sessions.find((s) => s.id === sheet.sessionId) : void 0;
	const walkins = sessions.filter((s) => s.kind === "walkin").length;
	const place = session ? sessionLabel(session, walkins) : "";
	switch (sheet.kind) {
		case "bar": return {
			title: "Bar",
			sub: place || "Joy tanlang"
		};
		case "discount": return {
			title: "Chegirma",
			sub: place
		};
		case "close": return {
			title: "Hisob",
			sub: place
		};
		case "split": return {
			title: "Aralash to'lov",
			sub: place
		};
		case "void": return {
			title: "Bekor qilish",
			sub: place
		};
		case "receipt": return {
			title: "Chek",
			sub: ""
		};
		case "history": return {
			title: "Tarix",
			sub: ""
		};
		case "bill": return {
			title: "Chek",
			sub: ""
		};
		case "settings": return {
			title: "Klub",
			sub: ""
		};
		case "menu": return {
			title: "Menyu",
			sub: "Ochiq hisobga ta'sir qilmaydi"
		};
		case "help": return {
			title: "Qanday ishlaydi",
			sub: ""
		};
		case "transfer": return {
			title: "Ko'chirish",
			sub: place
		};
		case "walkins": return {
			title: "Tashqi",
			sub: "Stolsiz mijozlar"
		};
		default: return {
			title: "",
			sub: ""
		};
	}
}
function SheetHeader({ sheet, stacked }) {
	const sessions = useClub((s) => s.sessions);
	const pop = useClub((s) => s.popSheet);
	const { title, sub } = sheetTitle(sheet, sessions);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shrink-0 px-4 pb-2 pt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-3 h-1.5 w-10 rounded-full bg-line" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center",
			children: [
				stacked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: pop,
					className: "key flex size-9 items-center justify-center rounded-full bg-elev text-fg",
					"aria-label": "Orqaga",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-9" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold text-balance",
						children: title
					}), sub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm text-muted",
						children: sub
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-9" })
			]
		})]
	});
}
function SheetBody({ sheet }) {
	switch (sheet.kind) {
		case "bar": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarSheet, {});
		case "discount": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscountSheet, { sessionId: sheet.sessionId });
		case "close": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseSheet, { sessionId: sheet.sessionId });
		case "split": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplitSheet, { sessionId: sheet.sessionId });
		case "void": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoidSheet, { sessionId: sheet.sessionId });
		case "receipt": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptSheet, { billId: sheet.billId });
		case "history": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistorySheet, {});
		case "bill": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptSheet, { billId: sheet.billId });
		case "settings": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsSheet, {});
		case "menu": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuSheet, {});
		case "help": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HelpSheet, {});
		case "transfer": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransferSheet, { sessionId: sheet.sessionId });
		case "walkins": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalkinSheet, {});
		default: return sheet;
	}
}
function useSession(sessionId) {
	return useClub((s) => sessionId ? s.sessions.find((item) => item.id === sessionId) ?? null : null);
}
function BarSheet() {
	const now = useNow();
	const sessions = useClub((s) => s.sessions);
	const focusId = useClub((s) => s.focusId);
	const menu = useClub((s) => s.menu);
	const roundUp = useClub((s) => s.settings.roundUp);
	const [category, setCategory] = (0, import_react.useState)("all");
	const focused = sessions.find((s) => s.id === focusId) ?? null;
	const walkins = sessions.filter((s) => s.kind === "walkin").length;
	const items = menu.filter((item) => category === "all" || item.category === category);
	const cart = focused ? quote(focused, now, roundUp) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3",
				children: [sessions.map((session) => {
					const on = session.id === focusId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => useClub.getState().focusSession(session.id),
						className: cn("key shrink-0 rounded-full px-4 py-2 text-left", on ? "bg-op text-fg" : "bg-elev text-fg"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-semibold",
							children: sessionLabel(session, walkins)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("block text-xs tabular-nums", on ? "text-fg/80" : "text-muted"),
							children: [
								session.kind === "table" ? formatClock(quote(session, now, roundUp).elapsed) : "bar",
								" · ",
								formatSom(quote(session, now, roundUp).total)
							]
						})]
					}, session.id);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "key shrink-0 rounded-full bg-elev px-4 py-2 text-sm font-semibold text-fg",
					onClick: () => useClub.getState().createWalkin(),
					children: "+ Tashqi"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3",
				children: CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCategory(item.id),
					className: cn("key shrink-0 rounded-full px-4 py-2 text-sm", category === item.id ? "bg-fg text-bg" : "bg-elev text-fg"),
					children: item.label
				}, item.id))
			}),
			sessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 pb-4 text-sm text-muted",
				children: "Avval stol raqamini bosing yoki tashqi mijoz oching. Buyurtma shu joyga yoziladi."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 px-4 pb-4",
				children: items.map((item) => {
					const qty = focused ? itemQty(focused.items, item.id) : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl bg-elev p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "w-full text-left",
							disabled: !focused,
							onClick: () => useClub.getState().addMenu(item.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-base font-medium",
								children: item.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-sm tabular-nums text-muted",
								children: formatSom(item.price)
							})]
						}), qty > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-end gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "key flex size-9 items-center justify-center rounded-full bg-fn text-lg text-fg",
									"aria-label": `${item.name}ni ayirish`,
									onClick: () => useClub.getState().decMenu(item.id),
									children: "−"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-5 text-center font-semibold tabular-nums",
									children: qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "key flex size-9 items-center justify-center rounded-full bg-op text-lg text-fg",
									"aria-label": `${item.name} qo'shish`,
									onClick: () => useClub.getState().addMenu(item.id),
									children: "+"
								})
							]
						}) : null]
					}, item.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pad-safe sticky bottom-0 border-t border-line bg-sheet px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "key h-12 w-full rounded-full bg-op text-base font-semibold text-fg",
					onClick: () => useClub.getState().popSheet(),
					children: cart && focused ? `Tayyor · ${sessionLabel(focused, walkins)} · ${formatSom(cart.total)}` : "Tayyor"
				})
			})
		]
	});
}
var DISCOUNTS = [
	0,
	5,
	10,
	15,
	20,
	30,
	50,
	100
];
function DiscountSheet({ sessionId }) {
	const session = useSession(sessionId);
	const now = useNow();
	const roundUp = useClub((s) => s.settings.roundUp);
	const [pct, setPct] = (0, import_react.useState)(session?.discountPct ?? 0);
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Missing, {});
	const preview = quote({
		...session,
		discountPct: pct
	}, now, roundUp);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pad-safe px-4 pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 gap-3",
				children: DISCOUNTS.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPct(value),
					className: cn("key aspect-square rounded-full text-sm font-semibold", pct === value ? "bg-op text-fg" : "bg-elev text-fg"),
					children: value === 0 ? "Yo'q" : value === 100 ? "Bepul" : `${value}%`
				}, value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-center text-sm text-muted",
				children: ["Yangi jami ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-base font-semibold text-fg tabular-nums",
					children: formatSom(preview.total)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-fg",
				onClick: () => useClub.getState().setDiscount(sessionId, pct),
				children: "Qo'llash"
			})
		]
	});
}
function CloseSheet({ sessionId }) {
	const session = useSession(sessionId);
	const now = useNow();
	const roundUp = useClub((s) => s.settings.roundUp);
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Missing, {});
	const q = quote(session, now, roundUp);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pad-safe px-4 pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-center text-sm text-muted",
				children: [session.kind === "table" ? `${formatClock(q.elapsed)} · ${q.minutes} daq` : "Faqat bar", session.pauseStartedAt ? " · pauza" : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-center text-5xl font-light tabular-nums text-fg",
				children: formatSom(q.total)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 divide-y divide-line",
				children: [
					session.kind === "table" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyLine, {
						label: "Vaqt",
						detail: `${q.minutes} daq × ${formatSom(session.ratePerHour)}/soat${session.vip ? " · VIP" : ""}`,
						amount: q.time
					}) : null,
					session.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyLine, {
						label: item.qty > 1 ? `${item.name} × ${item.qty}` : item.name,
						amount: item.price * item.qty
					}, item.id)),
					q.discountAmt > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyLine, {
						label: `Chegirma ${session.discountPct}%`,
						amount: q.discountAmt,
						negative: true
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "key h-14 rounded-full bg-op text-base font-semibold text-fg",
					onClick: () => useClub.getState().closeBill(sessionId, q.total, 0),
					children: "Naqd"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "key h-14 rounded-full bg-fn text-base font-semibold text-fg",
					onClick: () => useClub.getState().closeBill(sessionId, 0, q.total),
					children: "Karta"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "key mt-3 h-12 w-full rounded-full bg-elev text-base font-medium text-fg",
				onClick: () => useClub.getState().pushSheet({
					kind: "split",
					sessionId
				}),
				children: "Aralash"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-3 w-full py-3 text-sm text-muted",
				onClick: () => useClub.getState().pushSheet({
					kind: "void",
					sessionId
				}),
				children: "Hisobni bekor qilish"
			})
		]
	});
}
function SplitSheet({ sessionId }) {
	const session = useSession(sessionId);
	const now = useNow();
	const roundUp = useClub((s) => s.settings.roundUp);
	const [raw, setRaw] = (0, import_react.useState)("");
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Missing, {});
	const total = quote(session, now, roundUp).total;
	const cash = Number(raw || "0");
	const card = total - cash;
	const valid = cash > 0 && cash < total;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pad-safe px-4 pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-center text-sm text-muted",
				children: ["Jami ", formatSom(total)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				inputMode: "numeric",
				value: raw ? formatSom(cash) : "",
				placeholder: "Naqd summa",
				"aria-label": "Naqd summa",
				onChange: (event) => setRaw(event.target.value.replace(/\D/g, "").slice(0, 7)),
				className: "mt-3 w-full rounded-2xl bg-bg px-4 py-4 text-2xl text-fg outline-none tabular-nums"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "key rounded-full bg-elev px-4 py-2 text-sm text-fg",
					onClick: () => setRaw(String(Math.floor(total / 2))),
					children: "Yarmi"
				}), [
					1e4,
					2e4,
					5e4,
					1e5
				].map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "key rounded-full bg-elev px-4 py-2 text-sm tabular-nums text-fg",
					onClick: () => setRaw(String(Math.min(total - 1, cash + chip))),
					children: ["+", formatSom(chip)]
				}, chip))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-center text-sm text-muted",
				children: ["Kartaga ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-fg tabular-nums",
					children: formatSom(Math.max(0, card))
				})]
			}),
			!valid && cash > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-center text-sm text-op",
				children: "Naqd jami ichida bo'lsin"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: !valid,
				className: "key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-fg disabled:opacity-40",
				onClick: () => useClub.getState().closeBill(sessionId, cash, total - cash),
				children: "Yopish"
			})
		]
	});
}
function VoidSheet({ sessionId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pad-safe px-4 pb-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-center text-base text-pretty",
			children: "Hisob yopiladi, lekin pul tushumga kirmaydi. Tasodifiy ochilgan stol uchun."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid grid-cols-2 gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "key h-12 rounded-full bg-elev text-base font-medium text-fg",
				onClick: () => useClub.getState().popSheet(),
				children: "Qoldirish"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "key h-12 rounded-full bg-op text-base font-semibold text-fg",
				onClick: () => useClub.getState().voidBill(sessionId),
				children: "Bekor qilish"
			})]
		})]
	});
}
function ReceiptSheet({ billId }) {
	const bill = useClub((s) => s.bills.find((item) => item.id === billId) ?? null);
	const clubName = useClub((s) => s.settings.clubName);
	if (!bill) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Missing, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pad-safe px-4 pb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl bg-elev px-4 py-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-sm font-semibold tracking-widest text-muted",
					children: clubName.toUpperCase()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-center text-lg font-semibold",
					children: bill.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-sm text-muted",
					children: formatWhen(bill.closedAt)
				}),
				bill.voided ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-center text-sm font-semibold tracking-widest text-op",
					children: "BEKOR"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 divide-y divide-line",
					children: [
						bill.kind === "table" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyLine, {
							label: "Vaqt",
							detail: `${bill.billedMinutes} daq × ${formatSom(bill.ratePerHour)}/soat`,
							amount: bill.timeCharge
						}) : null,
						bill.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyLine, {
							label: item.qty > 1 ? `${item.name} × ${item.qty}` : item.name,
							amount: item.price * item.qty
						}, item.id)),
						bill.discountAmt > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyLine, {
							label: `Chegirma ${bill.discountPct}%`,
							amount: bill.discountAmt,
							negative: true
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-baseline justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: "Jami"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-2xl font-medium tabular-nums",
						children: formatSom(bill.total)
					})]
				}),
				!bill.voided ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-right text-sm text-muted",
					children: bill.card > 0 && bill.cash > 0 ? `Naqd ${formatSom(bill.cash)} · karta ${formatSom(bill.card)}` : bill.card > 0 ? "Karta" : "Naqd"
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-fg",
			onClick: () => useClub.getState().popSheet(),
			children: "Tayyor"
		})]
	});
}
function HistorySheet() {
	const bills = useClub((s) => s.bills);
	const now = useNow();
	const [todayOnly, setTodayOnly] = (0, import_react.useState)(true);
	const today = tashkentDay(now || Date.now());
	const shown = bills.filter((bill) => !todayOnly || tashkentDay(bill.closedAt) === today);
	const paid = shown.filter((bill) => !bill.voided);
	const revenue = paid.reduce((sum, bill) => sum + bill.total, 0);
	const cash = paid.reduce((sum, bill) => sum + bill.cash, 0);
	const card = paid.reduce((sum, bill) => sum + bill.card, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pad-safe px-4 pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 grid grid-cols-2 gap-2 rounded-full bg-elev p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("key rounded-full py-2 text-sm", todayOnly ? "bg-op text-fg" : "text-muted"),
					onClick: () => setTodayOnly(true),
					children: "Bugun"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("key rounded-full py-2 text-sm", !todayOnly ? "bg-op text-fg" : "text-muted"),
					onClick: () => setTodayOnly(false),
					children: "Hammasi"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Tushum",
						value: formatSom(revenue)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Naqd",
						value: formatSom(cash)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Karta",
						value: formatSom(card)
					})
				]
			}),
			shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 py-10 text-center text-sm text-muted",
				children: "Hali yopilgan hisob yo'q."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-line",
				children: shown.map((bill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full items-center justify-between gap-3 py-3 text-left",
					onClick: () => useClub.getState().pushSheet({
						kind: "bill",
						billId: bill.id
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("block text-base", bill.voided && "text-muted line-through"),
						children: bill.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block text-sm text-muted",
						children: [formatWhen(bill.closedAt), bill.voided ? " · bekor" : ""]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("tabular-nums", bill.voided ? "text-muted" : "text-fg"),
						children: formatSom(bill.total)
					})]
				}) }, bill.id))
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-elev px-2 py-3 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm font-semibold tabular-nums",
			children: value
		})]
	});
}
function SettingsSheet() {
	const settings = useClub((s) => s.settings);
	const [name, setName] = (0, import_react.useState)(settings.clubName);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pad-safe space-y-4 px-4 pb-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-3xl bg-elev",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: "Nomi"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: name,
						maxLength: 32,
						"aria-label": "Klub nomi",
						onChange: (event) => setName(event.target.value),
						onBlur: () => useClub.getState().setClubName(name),
						className: "w-40 bg-transparent text-right text-base text-fg outline-none"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 rounded-3xl bg-elev px-4 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
						label: "Oddiy soat",
						value: settings.rate,
						min: 5e3,
						max: 5e5,
						step: 5e3,
						onChange: (rate) => useClub.getState().patchSettings({ rate })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
						label: "VIP soat",
						value: settings.vipRate,
						min: 5e3,
						max: 8e5,
						step: 5e3,
						onChange: (vipRate) => useClub.getState().patchSettings({ vipRate })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Ochiq stollarga yangi narx qo'yilmaydi."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-elev px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Vaqt yaxlitlash"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-2 gap-2",
					children: [[1, "1 daqiqa"], [15, "15 daqiqa"]].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cn("key rounded-full py-2 text-sm", settings.roundUp === value ? "bg-op text-fg" : "bg-key text-fg"),
						onClick: () => useClub.getState().patchSettings({ roundUp: value }),
						children: label
					}, value))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-elev px-4 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Stollar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-3 gap-2",
						children: [
							6,
							8,
							9
						].map((count) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("key rounded-full py-2 text-sm", settings.tableCount === count ? "bg-op text-fg" : "bg-key text-fg"),
							onClick: () => useClub.getState().setTableCount(count),
							children: count
						}, count))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "VIP stollar — yangi hisob VIP narxda ochiladi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-5 gap-2",
						children: Array.from({ length: settings.tableCount }, (_, i) => i + 1).map((n) => {
							const on = settings.vipTables.includes(n);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": on,
								className: cn("key aspect-square rounded-full text-sm font-semibold", on ? "bg-op text-fg" : "bg-key text-fg"),
								onClick: () => useClub.getState().toggleVipTable(n),
								children: n
							}, n);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "key flex h-12 w-full items-center justify-between rounded-full bg-elev px-5 text-base text-fg",
				onClick: () => useClub.getState().pushSheet({ kind: "menu" }),
				children: ["Menyu narxlari", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4 rotate-180" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "key flex h-12 w-full items-center justify-between rounded-full bg-elev px-5 text-base text-fg",
				onClick: () => useClub.getState().pushSheet({ kind: "help" }),
				children: ["Qanday ishlaydi", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4 rotate-180" })]
			})
		]
	});
}
function Stepper({ label, value, min, max, step, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex items-center justify-between gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "key flex size-11 items-center justify-center rounded-full bg-key text-fg",
				"aria-label": `${label} kamaytirish`,
				onClick: () => onChange(Math.max(min, value - step)),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-lg font-medium tabular-nums",
				children: formatSom(value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "key flex size-11 items-center justify-center rounded-full bg-key text-fg",
				"aria-label": `${label} oshirish`,
				onClick: () => onChange(Math.min(max, value + step)),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
			})
		]
	})] });
}
function MenuSheet() {
	const menu = useClub((s) => s.menu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pad-safe px-4 pb-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-line",
			children: menu.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between gap-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-base",
					children: item.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm tabular-nums text-muted",
					children: formatSom(item.price)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "key flex size-10 items-center justify-center rounded-full bg-elev text-fg",
						"aria-label": `${item.name} narxini kamaytirish`,
						onClick: () => useClub.getState().setMenuPrice(item.id, item.price - 1e3),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "key flex size-10 items-center justify-center rounded-full bg-elev text-fg",
						"aria-label": `${item.name} narxini oshirish`,
						onClick: () => useClub.getState().setMenuPrice(item.id, item.price + 1e3),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
					})]
				})]
			}, item.id))
		})
	});
}
var HELP = [
	["1–9", "Bo'sh stol ochiladi, vaqt yura boshlaydi."],
	["Yana", "Ishlayotgan stolni bossangiz hisob ochiladi — naqd, karta yoki aralash."],
	["0", "Tashqi mijoz. Vaqt yozilmaydi, faqat bar."],
	["BAR", "Ichimlikni ochiq stolga yoki yangi tashqiga biriktirish."],
	["%", "Chegirma. QO'SH — qo'shimcha summa. AYIR — oxirgi buyurtma."],
	["PAUZA", "Vaqtni to'xtatadi. VIP — narxni almashtiradi. KO'CH — boshqa stol."],
	["AC", "Ko'rinishni tozalaydi. Ochiq hisoblar o'chmaydi."]
];
function HelpSheet() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pad-safe space-y-3 px-4 pb-5",
		children: HELP.map(([title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl bg-elev px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-op",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-pretty text-fg",
				children: body
			})]
		}, title))
	});
}
function TransferSheet({ sessionId }) {
	const session = useSession(sessionId);
	const sessions = useClub((s) => s.sessions);
	const tableCount = useClub((s) => s.settings.tableCount);
	const [pick, setPick] = (0, import_react.useState)(null);
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Missing, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pad-safe px-4 pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-muted",
				children: session.kind === "walkin" ? "Bo'sh stolga o'tkazilsa, vaqt hozirdan boshlanadi. Bar buyurtmalari saqlanadi." : "Hisob boshqa bo'sh stolga o'tadi. Narx o'zgarmaydi."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-3",
				children: Array.from({ length: tableCount }, (_, i) => i + 1).map((n) => {
					const busy = sessions.some((s) => s.kind === "table" && s.table === n);
					const current = session.kind === "table" && session.table === n;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: () => setPick(n),
						className: cn("key aspect-square rounded-full text-xl", current && "bg-fg text-bg", !current && pick === n && "bg-op text-fg", !current && pick !== n && "bg-key text-fg"),
						children: current ? "shu" : busy ? "band" : n
					}, n);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: pick === null,
				className: "key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-fg disabled:opacity-40",
				onClick: () => pick !== null && useClub.getState().transferTo(sessionId, pick),
				children: "Ko'chirish"
			})
		]
	});
}
function WalkinSheet() {
	const now = useNow();
	const sessions = useClub((s) => s.sessions.filter((s) => s.kind === "walkin"));
	const roundUp = useClub((s) => s.settings.roundUp);
	const count = useClub((s) => s.sessions).filter((s) => s.kind === "walkin").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pad-safe px-4 pb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-line",
			children: sessions.map((session) => {
				const q = quote(session, now, roundUp);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "min-w-0 flex-1 text-left",
						onClick: () => {
							useClub.getState().focusSession(session.id);
							useClub.getState().popSheet();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-base font-medium",
							children: sessionLabel(session, count)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm tabular-nums text-muted",
							children: formatSom(q.total)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "key rounded-full bg-op px-4 py-2 text-sm font-semibold text-fg",
						onClick: () => {
							useClub.getState().focusSession(session.id);
							useClub.getState().pushSheet({
								kind: "close",
								sessionId: session.id
							});
						},
						children: "Hisob"
					})]
				}, session.id);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "key mt-4 h-12 w-full rounded-full bg-elev text-base font-semibold text-fg",
			onClick: () => useClub.getState().createWalkin(),
			children: "+ Yangi tashqi"
		})]
	});
}
function MoneyLine({ label, detail, amount, negative }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base",
				children: label
			}), detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: detail
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "shrink-0 text-base tabular-nums",
			children: negative ? `−${formatSom(amount)}` : formatSom(amount)
		})]
	});
}
function Missing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-4 pb-6 text-center text-sm text-muted",
		children: "Bu hisob allaqachon yopilgan."
	});
}
function ClubApp() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NowProvider, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClubScreen, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHost, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			theme: "dark",
			position: "top-center",
			toastOptions: { style: {
				background: "var(--color-sheet)",
				color: "var(--color-fg)",
				border: "1px solid var(--color-line)"
			} }
		})
	] });
}
function ClubScreen() {
	const now = useNow();
	const sessions = useClub((s) => s.sessions);
	const focusId = useClub((s) => s.focusId);
	const entry = useClub((s) => s.entry);
	const settings = useClub((s) => s.settings);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const tag = event.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			const api = useClub.getState();
			if (api.sheets.length && event.key !== "Escape") return;
			if (event.key >= "1" && event.key <= "9") {
				event.preventDefault();
				api.pressTable(Number(event.key));
			} else if (event.key === "0") {
				event.preventDefault();
				api.pressWalkin();
			} else if (event.key === "Escape") api.pressAC();
			else if (event.key === "Enter" || event.key === "=") {
				event.preventDefault();
				api.pressHisob();
			} else if (event.key === "Backspace") {
				event.preventDefault();
				api.pressUndo();
			} else if (event.key === "+") api.pressAdd();
			else if (event.key === "%") api.pressDiscount();
			else if (event.key === "-" || event.key === "_") api.pressRemove();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const focused = sessions.find((s) => s.id === focusId) ?? null;
	const walkins = sessions.filter((s) => s.kind === "walkin").length;
	const typing = entry !== null;
	const openTotal = sessions.reduce((sum, session) => sum + quote(session, now, settings.roundUp).total, 0);
	let label = "STOL TANLANG";
	let amount = "0";
	let hint = "Raqam — stolni boshlash · 0 — tashqi";
	let extra = "";
	if (typing && focused) {
		label = `QO'SHIMCHA · ${sessionLabel(focused, walkins).toUpperCase()}`;
		amount = formatSom(Number(entry.buffer));
		hint = "HISOB — tasdiqlash · AC — bekor";
	} else if (focused) {
		const q = quote(focused, now, settings.roundUp);
		label = sessionLabel(focused, walkins).toUpperCase();
		if (focused.vip) label += " · VIP";
		if (focused.pauseStartedAt) label += " · PAUZA";
		amount = formatSom(q.total);
		if (focused.kind === "walkin") hint = `Bar ${formatSom(q.bar)} · vaqt hisobi yo'q`;
		else hint = `${formatClock(q.elapsed)} · vaqt ${formatSom(q.time)} · bar ${formatSom(q.bar)}`;
		if (focused.discountPct) hint += ` · −${focused.discountPct}%`;
		extra = "Yopish — shu tugmani yana bosing";
	} else if (sessions.length > 0) {
		label = "OCHIQ HISOB";
		amount = formatSom(openTotal);
		hint = `${sessions.length} ta ochiq · raqam yangi stol ochadi`;
	}
	const barQty = focused?.items.reduce((sum, item) => sum + item.qty, 0) ?? 0;
	const paused = Boolean(focused?.pauseStartedAt);
	const onDisplay = () => {
		const api = useClub.getState();
		if (api.entry) return;
		if (api.focusId) api.pressHisob();
		else api.pushSheet({ kind: "history" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between px-4 pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "key flex size-12 items-center justify-center rounded-full bg-key text-fg",
						"aria-label": "Tarix",
						onClick: () => useClub.getState().pushSheet({ kind: "history" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, {
							className: "size-5",
							strokeWidth: 1.75
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-40 truncate text-center text-sm text-muted",
						children: settings.clubName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "key flex size-12 items-center justify-center rounded-full bg-key text-fg",
						"aria-label": "Sozlamalar",
						onClick: () => useClub.getState().pushSheet({ kind: "settings" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {
							className: "size-5",
							strokeWidth: 1.75
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-label": typing ? "Qo'shimcha summa" : focused ? "Joriy hisob" : "Ochiq hisob",
				onClick: onDisplay,
				className: "flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-5 pb-4 text-right",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mb-2 flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium tracking-widest text-muted",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted",
							children: "so'm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "display-num text-fg",
						"data-len": displayBucket(amount),
						children: amount
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-3 block min-h-10 text-sm text-muted",
						children: hint
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block min-h-5 text-sm text-op",
						children: extra
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "pad-safe grid grid-cols-4 gap-3 px-3",
				"aria-label": "Boshqaruv",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, {
						kind: "symbol",
						tone: "fn",
						ariaLabel: "Bekor qilish",
						onClick: () => useClub.getState().pressUndo(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delete, {
							className: "size-6",
							strokeWidth: 1.75
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, {
						kind: "symbol",
						tone: "fn",
						label: "AC",
						ariaLabel: "Tozalash",
						onClick: () => useClub.getState().pressAC()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, {
						kind: focused && focused.discountPct && !typing ? "word" : "symbol",
						tone: "fn",
						active: Boolean(focused && focused.discountPct > 0 && !typing),
						disabled: typing,
						label: focused && focused.discountPct && !typing ? `${focused.discountPct}%` : "%",
						ariaLabel: "Chegirma",
						onClick: () => useClub.getState().pressDiscount()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, {
						kind: "word",
						tone: "op",
						label: "BAR",
						badge: typing ? 0 : barQty,
						disabled: typing,
						ariaLabel: "Bar",
						onClick: () => useClub.getState().pressBar()
					}),
					[
						7,
						8,
						9
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableKey, {
						n,
						typing,
						now
					}, n)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, {
						kind: "word",
						tone: "op",
						active: paused && !typing,
						disabled: typing,
						label: paused && !typing ? "DAVOM" : "PAUZA",
						ariaLabel: paused ? "Davom ettirish" : "Pauza",
						onClick: () => useClub.getState().pressPause()
					}),
					[
						4,
						5,
						6
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableKey, {
						n,
						typing,
						now
					}, n)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, {
						kind: "word",
						tone: "op",
						label: "AYIR",
						disabled: typing,
						ariaLabel: "Ayirish",
						onClick: () => useClub.getState().pressRemove()
					}),
					[
						1,
						2,
						3
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableKey, {
						n,
						typing,
						now
					}, n)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, {
						kind: "word",
						tone: "op",
						active: typing,
						label: "QO'SH",
						ariaLabel: "Qo'shish",
						onClick: () => useClub.getState().pressAdd()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, {
						kind: "word",
						tone: "fn",
						label: "KO'CH",
						disabled: typing,
						ariaLabel: "Ko'chirish",
						onClick: () => useClub.getState().pressTransfer()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, {
						kind: typing ? "digit" : "digit",
						tone: "num",
						label: "0",
						sub: typing ? void 0 : "tashqi",
						active: !typing && focused?.kind === "walkin",
						live: !typing && walkins > 0 && focused?.kind !== "walkin",
						ariaLabel: "Tashqi",
						onClick: () => useClub.getState().pressWalkin()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, {
						kind: typing ? "symbol" : "word",
						tone: "fn",
						active: !typing && Boolean(focused?.vip),
						label: typing ? "000" : "VIP",
						ariaLabel: typing ? "Ming qo'shish" : "VIP narx",
						onClick: () => useClub.getState().pressVip()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, {
						kind: "word",
						tone: "op",
						label: "HISOB",
						ariaLabel: "Hisob",
						onClick: () => useClub.getState().pressHisob()
					})
				]
			})
		]
	});
}
function TableKey({ n, typing, now }) {
	const sessions = useClub((s) => s.sessions);
	const focusId = useClub((s) => s.focusId);
	const tableCount = useClub((s) => s.settings.tableCount);
	const session = sessions.find((s) => s.kind === "table" && s.table === n);
	const focused = session?.id === focusId;
	const enabled = typing || n <= tableCount;
	const paused = Boolean(session?.pauseStartedAt);
	const sub = !typing && session ? paused ? "pauza" : formatClock(elapsedMs(session, now)) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, {
		kind: "digit",
		tone: "num",
		label: String(n),
		sub,
		active: !typing && focused,
		live: !typing && Boolean(session) && !focused && !paused,
		paused: !typing && paused && !focused,
		disabled: !enabled,
		ariaLabel: `Stol ${n}`,
		onClick: () => useClub.getState().pressTable(n)
	});
}
function toneClass(tone, active) {
	if (active && tone === "op") return "bg-fg text-op";
	if (active) return "bg-fg text-bg";
	if (tone === "op") return "bg-op text-fg";
	if (tone === "fn") return "bg-fn text-fg";
	return "bg-key text-fg";
}
function labelClass(kind, hasSub) {
	if (kind === "digit") return hasSub ? "text-3xl font-normal" : "text-4xl font-normal";
	if (kind === "symbol") return "text-3xl font-normal";
	return "text-sm font-semibold tracking-wide";
}
function Key({ label, sub, tone, kind, active, disabled, live, paused, badge, ariaLabel, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-label": ariaLabel,
		disabled,
		onClick: () => {
			if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(8);
			onClick();
		},
		className: cn("key relative flex aspect-square items-center justify-center rounded-full", toneClass(tone, Boolean(active)), live && "key-live", paused && "key-paused"),
		children: [badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-fg text-xs font-semibold text-bg",
			children: badge > 9 ? "9+" : badge
		}) : null, children ?? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex flex-col items-center px-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn(labelClass(kind, Boolean(sub)), "leading-none"),
				children: label
			}), sub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("mt-1 text-xs font-medium leading-none tabular-nums", active ? "text-bg/70" : live || paused ? "text-op" : "text-muted"),
				children: sub
			}) : null]
		})]
	});
}
var SplitComponent = ClubApp;
//#endregion
export { SplitComponent as component };
