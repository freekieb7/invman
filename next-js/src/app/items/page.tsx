export default function Page() {
  return (
    <div className="flex justify-center">
      <table className="table-auto bg-slate-800 text-white">
        <thead>
          <tr className="border-b border-slate-600 text-left">
            <th className="p-2">Song</th>
            <th className="p-2">Artist</th>
            <th className="p-2">Year</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-2 py-1">
              The Sliding Mr. Bones (Next Stop,
              Pottersville)aaaaaaaaaaaaaaaaaaaaaaa
            </td>
            <td className="px-2 py-1">Malcolm Lockyer</td>
            <td className="px-2 py-1">1961</td>
          </tr>
          <tr>
            <td className="px-2 py-1">Witchy Woman</td>
            <td className="px-2 py-1">The Eagles</td>
            <td className="px-2 py-1">1972</td>
          </tr>
          <tr>
            <td className="px-2 py-1">Shining Star</td>
            <td className="px-2 py-1">Earth, Wind, and Fire</td>
            <td className="px-2 py-1">1975</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
