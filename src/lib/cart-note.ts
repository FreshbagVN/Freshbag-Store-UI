"use client";
import { useSyncExternalStore } from "react";
const key = "freshbag-cart-note";
const event = "freshbag-note-change";
const subscribe = (callback: () => void) => { window.addEventListener(event,callback); window.addEventListener("storage",callback); return () => { window.removeEventListener(event,callback); window.removeEventListener("storage",callback); }; };
export function setCartNote(note: string) { sessionStorage.setItem(key,note.slice(0,500)); window.dispatchEvent(new Event(event)); }
export function useCartNote() { return useSyncExternalStore(subscribe,() => sessionStorage.getItem(key) || "",() => ""); }
