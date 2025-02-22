import { Table } from "@/types/table";
import React, { useState, useEffect } from "react";

interface UpdateTableFormProps {
  table_data: Table;
  statusItems: { value: string; title: string }[];
  onSubmit: (TableData: Table) => void;
}

const UpdateTableForm: React.FC<UpdateTableFormProps> = ({ table_data, statusItems, onSubmit }) => {
  const [TableData, setTableData] = useState<Table>({
    table_id: "",
    table_number: "",
    table_status: "",
    add_date: ""
  });

  useEffect(() => {
    fetchdata()
  }, []);

  const fetchdata = async () => {
    setTableData(table_data)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTableData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(TableData)
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 rounded-2xl">
      <h2>เพิ่มโต๊ะใหม่</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>หมายเลขโต๊ะ:</label>
          <input
            type="text"
            name="table_number"
            value={TableData.table_number}
            onChange={handleChange}
            placeholder="กรอกหมายเลขโต๊ะ"
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>สถานะโต๊ะ:</label>
          <select
            name="table_status"
            value={TableData.table_status}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            {statusItems.map(item => (
              <option value={item.value} key={item.value}>{item.title}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          เพิ่มโต๊ะ
        </button>
      </form>
    </div>
  );
}

export default UpdateTableForm