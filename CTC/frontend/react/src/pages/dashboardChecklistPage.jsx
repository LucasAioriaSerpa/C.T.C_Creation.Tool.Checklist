import '../css/dashboardChecklistPage.css'

export default function DashboardChecklistPage() {
    return (
        <>
            <header className='header-page-dashboard'><strong>Dashboards Checklists</strong></header>
            <section className='dashboard-checklits'>
                <div className='campo-checklist'>
                    <div className='card-checklist'>
                        <div className='name-checklist'>
                            <h3>Nome da Checklist</h3>
                        </div>
                        <div className='descrition-checklist'>
                            <h5>Descrição: dhgfsihdgiushdfgoshdogfsi</h5>
                        </div>
                        <div className='creators'>
                            <div className='creation-date'>
                                <h5>Data Criação</h5>
                            </div>
                            <div className='creator-checklist'>
                                <h5>Criador: Auditor</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
