import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import postcss from 'postcss';
const css=postcss.parse(readFileSync(new URL('../app/globals.css',import.meta.url),'utf8'));
test('the botanical palette has one root source of truth',()=>{
 const roots=css.nodes.filter(node=>node.type==='rule'&&node.selector===':root');
 assert.equal(roots.length,1);
 const values=Object.fromEntries(roots[0].nodes.map(node=>[node.prop,node.value]));
 assert.equal(values['--paper'],'#fffefc');assert.equal(values['--ink'],'#0f3e17');assert.equal(values['--teal-soft'],'#e1f4df');
});
test('shared UI preserves keyboard focus and reduced-motion support',()=>{
 const text=css.toString();assert.match(text,/:focus-visible/);assert.match(text,/prefers-reduced-motion:reduce/);assert.match(text,/\.skip-link:focus/);
});
test('cards do not use decorative shadows',()=>{
 css.walkDecls('box-shadow',decl=>assert.equal(decl.value,'none'));
});
