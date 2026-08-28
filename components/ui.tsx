import {ReactNode} from "react";
export function PageHeader({title,description,badge,actions}:{title:string;description:string;badge?:string;actions?:ReactNode}){return <header className="page-header"><div><h1>{title}</h1><p>{description}</p></div><div className="page-header-actions">{badge&&<Badge>{badge}</Badge>}{actions}</div></header>}
export function Badge({children,tone="teal"}:{children:ReactNode;tone?:"teal"|"blue"|"amber"|"red"}){return <span className={`badge badge-${tone}`}>{children}</span>}
export function StatGrid({children,columns=4}:{children:ReactNode;columns?:3|4|5}){return <section className={`stat-grid stat-grid-${columns}`}>{children}</section>}
export function StatCard({label,value,help,tone}:{label:string;value:ReactNode;help?:string;tone?:"positive"|"negative"}){return <article className="stat-card"><span>{label}</span><strong className={tone??""}>{value}</strong>{help&&<small>{help}</small>}</article>}
export function Section({title,description,actions,children}:{title:string;description?:string;actions?:ReactNode;children:ReactNode}){return <section className="panel-section"><div className="section-header"><div><h2>{title}</h2>{description&&<p>{description}</p>}</div>{actions}</div>{children}</section>}
export function EmptyState({children}:{children:ReactNode}){return <div className="empty-state">{children}</div>}
