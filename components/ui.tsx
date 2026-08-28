import {ReactNode} from "react";
export function StatGrid({children,columns=4}:{children:ReactNode;columns?:3|4|5}){return <section className={`stat-grid stat-grid-${columns}`}>{children}</section>}
export function StatCard({label,value,help,tone}:{label:string;value:ReactNode;help?:string;tone?:"positive"|"negative"}){return <article className="stat-card"><span>{label}</span><strong className={tone??""}>{value}</strong>{help&&<small>{help}</small>}</article>}
export function Section({title,description,actions,children}:{title:string;description?:string;actions?:ReactNode;children:ReactNode}){return <section className="panel-section"><div className="section-header"><div><h2>{title}</h2>{description&&<p>{description}</p>}</div>{actions}</div>{children}</section>}
export function EmptyState({children}:{children:ReactNode}){return <div className="empty-state">{children}</div>}
