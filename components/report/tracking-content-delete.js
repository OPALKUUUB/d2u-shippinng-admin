import { Table } from "antd"
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

function TrackingContentDelete() {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const getDataTable = async () => {
        setLoading(true)
        try {
            const url = `/api/tracking/contentDelete`
            const response = await axios.get(url)
            const responseData = response.data.data
            setData(responseData)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
            console.log("Get Data Table Successfully!");
        }
    }

    useEffect(() => {
        getDataTable()
    }, [])

    const columns = [
        {
            title: "วันที่",
            dataIndex: "date",
            key: "date"
        },
        {
            title: "ชื่อลูกค้า",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "URL",
            dataIndex: "link",
            key: "link",
            render: (text) => text === "" || text === null ? "-" : <Link href={text}>{text.slice(0, 10)}...</Link>
        },
        {
            title: "หมายเหตุ",
            dataIndex: "remark_admin",
            key: "remark_admin",
        },
        {
            title: "created_at",
            dataIndex: "created_at",
            key: "created_at",
        },
    ]
    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={loading}
        />
    )
}

export default TrackingContentDelete