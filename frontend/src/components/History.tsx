import { useState, useEffect } from 'preact/hooks'
import Pagination from './Pagination'

const History = () => {
    const [page, setPage] = useState<number>(1)
    const [total, setTotal] = useState<number>(50)


    const handlePageChange = (page: number) => {
        // setPage(page)
        // loadTranscript(currentNav, currentOpt, page).then(res => {
        //     if (res && res.code === 0) {
        //         setData(res.data.data)
        //         setTotal(res.data.total)
        //     }
        // }).catch(e => message.error(e.toString()))
    }


    return (
        <div class="app-history">
            <div class="history-card">
                <div class="card-left">
                    <img src="../assets/images/0012.jpg" />
                </div>
                <div class="card-right">
                    <div class="right-top">
                        <h3>Maine Coon</h3>
                        <span>Jan 15, 2024</span>
                    </div>
                    <div class="right-overview">
                        The Maine Coon is a large, friendly cat breed known for its tufted ears.
                    </div>
                </div>
            </div>

            <div class="history-card">
                <div class="card-left">
                    <img src="../assets/images/0012.jpg" />
                </div>
                <div class="card-right">
                    <div class="right-top">
                        <h3>Maine Coon</h3>
                        <span>Jan 15, 2024</span>
                    </div>
                    <div class="right-overview">
                        The Maine Coon is a large, friendly cat breed known for its tufted ears.
                    </div>
                </div>
            </div>

            <div class="history-card">
                <div class="card-left">
                    <img src="../assets/images/0012.jpg" />
                </div>
                <div class="card-right">
                    <div class="right-top">
                        <h3>Maine Coon</h3>
                        <span>Jan 15, 2024</span>
                    </div>
                    <div class="right-overview">
                        The Maine Coon is a large, friendly cat breed known for its tufted ears.
                    </div>
                </div>
            </div>

            <div class="history-card">
                <div class="card-left">
                    <img src="../assets/images/0012.jpg" />
                </div>
                <div class="card-right">
                    <div class="right-top">
                        <h3>Maine Coon</h3>
                        <span>Jan 15, 2024</span>
                    </div>
                    <div class="right-overview">
                        The Maine Coon is a large, friendly cat breed known for its tufted ears.
                    </div>
                </div>
            </div>

            <div class="history-card">
                <div class="card-left">
                    <img src="../assets/images/0012.jpg" />
                </div>
                <div class="card-right">
                    <div class="right-top">
                        <h3>Maine Coon</h3>
                        <span>Jan 15, 2024</span>
                    </div>
                    <div class="right-overview">
                        The Maine Coon is a large, friendly cat breed known for its tufted ears.
                    </div>
                </div>
            </div>

            <div class="history-pagination">
                <Pagination page={page} pagesize={5} total={total} onChange={handlePageChange} />
            </div>
        </div>
    )
}

export default History