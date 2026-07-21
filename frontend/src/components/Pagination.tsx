import { useState, useEffect } from 'preact/hooks'

interface IPagination {
    total: number
    onChange: (page: number) => void
    page: number
    pagesize: number
}

const Pagination = ({
    total,
    onChange,
    page,
    pagesize,
}: IPagination) => {
    const [value, setValue] = useState<string>('1')
    const [num, setNum] = useState<number>(1)
    const [seqNums, setSeqNums] = useState<[number, number][]>([])

    useEffect(() => {
        setValue('1')
        setNum(1)
    }, [])

    useEffect(() => {
        if (page) {
            setValue(page.toString());
            let nums: [number, number][] = []
            for (let i = 1; i < total / pagesize + 1; i++) {
                if (i === 1) {
                    nums.push([1, 1])
                } else {
                    nums.push([i, 0])
                }
            }
            setSeqNums(nums)
            calSeqNums(nums, page)
        }
    }, [total, page])

    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        setValue(target.value)
    }

    const handleEnterPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            const target = e.target as HTMLInputElement
            const page = parseInt(target.value)
            if (page >= 1 && page <= seqNums.length) {
                handleChangeNum(page)
                onChange(page)
            } else if (page > seqNums.length) {
                handleChangeNum(seqNums.length)
                onChange(seqNums.length)
            } else {
                handleChangeNum(1)
                onChange(1)
            }
        }
    }

    const calSeqNums = (seqNums: [number, number][], num: number) => {
        const seqNumsTemp = seqNums.map((item): [number, number] =>
            item[0] === num ? [item[0], 1] : [item[0], 0],
        )
        setSeqNums(seqNumsTemp)
        setNum(num)
    }

    const handleChangeNum = (val: number|string) => {
        if (typeof val === 'number') {
            setValue(String(val))
            if (val !== num) onChange(val)
            calSeqNums(seqNums, val)
        } else if (typeof val === 'string') {
            if (val === 'pre') {
                if (num > 1) {
                    calSeqNums(seqNums, num - 1)
                    setValue(String(num - 1))
                    onChange(num - 1)
                }
            } else if (val === 'next') {
                if (num < seqNums.length) {
                    calSeqNums(seqNums, num + 1)
                    setValue(String(num + 1))
                    onChange(num + 1)
                }
            }
        }
    }

    const calPaginationDom = () => {
        return seqNums.map((item) => (
            <span
                key={item[0]}
                className={`pagination-num${
                    item[1] === 1 ? ' pagination-num-selected' : ''
                }`}
                onClick={() => handleChangeNum(item[0])}
            >
                {item[0]}
            </span>
        ))
    }

    const calPaginationDomEtc = () => {
        return (
            <>
                {num < 5 && (
                    <>
                        {seqNums.slice(0, 5).map((item) => (
                            <span
                                key={item[0]}
                                className={`pagination-num${
                                    item[1] === 1 ? ' pagination-num-selected' : ''
                                }`}
                                onClick={() => handleChangeNum(item[0])}
                            >
                                {item[0]}
                            </span>
                        ))}
                        <span className="pagination-etc"> ... </span>
                        <span
                            className="pagination-num"
                            onClick={() => handleChangeNum(seqNums.length)}
                        >
                            {seqNums.length}
                        </span>
                    </>
                )}
                {num >= 5 && num <= seqNums.length - 4 && (
                    <>
                        <span className="pagination-num" onClick={() => handleChangeNum(1)}>
                            1
                        </span>
                        <span className="pagination-etc"> ... </span>
                        {seqNums.slice(num - 3, num + 2).map((item) => (
                            <span
                                key={item[0]}
                                className={`pagination-num${
                                    item[1] === 1 ? ' pagination-num-selected' : ''
                                }`}
                                onClick={() => handleChangeNum(item[0])}
                            >
                                {item[0]}
                            </span>
                        ))}
                        <span className="pagination-etc"> ... </span>
                        <span
                            className="pagination-num"
                            onClick={() => handleChangeNum(seqNums.length)}
                        >
                            {seqNums.length}
                        </span>
                    </>
                )}
                {num > seqNums.length - 4 && (
                    <>
                        <span
                            key={1}
                            className="pagination-num"
                            onClick={() => handleChangeNum(1)}
                        >
                            1
                        </span>
                        <span className="pagination-etc"> ... </span>
                        {seqNums.slice(seqNums.length - 5, seqNums.length).map((item) => (
                            <span
                                key={item[0]}
                                className={`pagination-num${
                                    item[1] === 1 ? ' pagination-num-selected' : ''
                                }`}
                                onClick={() => handleChangeNum(item[0])}
                            >
                                {item[0]}
                            </span>
                        ))}
                    </>
                )}
            </>
        )
    }

    return (
        <div className="div-pagination">
            <div className="div-pagination-core unselect">
                <span className="pagination-icon" onClick={() => handleChangeNum('pre')}>◀</span>
                {seqNums.length < 10 ? calPaginationDom() : calPaginationDomEtc()}
                <span className="pagination-icon" onClick={() => handleChangeNum('next')}>▶</span>
                <span className="pagination-word" style={{ marginLeft: 16 }}>
                    前往
                </span>
                <input
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleEnterPress}
                />
                <span className="pagination-word">页</span>
            </div>
        </div>
    )
}

export default Pagination