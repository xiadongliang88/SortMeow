import { useState, useEffect } from 'preact/hooks'
import Pagination from './Pagination'


const historyList = [
    {
        id: 1,
        breeds: '英短&1212',
        desc: 'The Maine Coon is a large, friendly cat breed known for its tufted ears.',
        img: '../../',
        date: 'Jan 15, 2024',
    },
    {
        id: 2,
        breeds: '英短&fdfd',
        desc: 'The Maine Coon is a large, friendly cat breed known for its tufted ears.',
        img: '../../',
        date: 'Jan 15, 2024',
    },
    {
        id: 3,
        breeds: '英短&11111',
        desc: 'The Maine Coon is a large, friendly cat breed known for its tufted ears.',
        img: '../../',
        date: 'Jan 15, 2024',
    },
    {
        id: 4,
        breeds: '英短&4545',
        desc: 'The Maine Coon is a large, friendly cat breed known for its tufted ears.',
        img: '../../',
        date: 'Jan 15, 2024',
    },
    {
        id: 5,
        breeds: '英短&fff',
        desc: 'The Maine Coon is a large, friendly cat breed known for its tufted ears.',
        img: '../../',
        date: 'Jan 15, 2024',
    },
]

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
            {historyList.map((item) => 
                <div key={item.id} class="history-card">
                    <div class="card-left">
                        <img src="../assets/images/0012.jpg" />
                    </div>
                    <div class="card-right">
                        <div class="right-top">
                            <h3>{item.breeds}</h3>
                            <span>{item.date}</span>
                        </div>
                        <div class="right-overview">
                            {item.desc}
                        </div>
                    </div>
                </div>)
            }

            <div class="history-pagination">
                <Pagination page={page} pagesize={5} total={total} onChange={handlePageChange} />
            </div>
        </div>
    )
}

export default History