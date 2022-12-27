import NextPageButton from "@/components/buttons/next-page-btn";
import PrevPageButton from "@/components/buttons/prev-page-btn";

export default function Page() {
  return (
    <div>
      <div className="flex justify-center">
        <table className="table-auto bg-slate-800 text-white rounded-md">
          <thead>
            <tr className="border-b border-slate-600 text-left">
              <th className="p-2">Song</th>
              <th className="p-2">Artist</th>
              <th className="p-2">Year</th>
            </tr>
          </thead>
          <tbody className="bg-slate-700">
            <tr className="border-b border-slate-600">
              <td className="px-2 py-1">
                The Sliding Mr. Bones (Next Stop,
                Pottersville)aaaaaaaaaaaaaaaaaaaaaaa
              </td>
              <td className="px-2 py-1">Malcolm Lockyer</td>
              <td className="px-2 py-1">1961</td>
            </tr>
            <tr className="border-b border-slate-600">
              <td className="px-2 py-1">Witchy Woman</td>
              <td className="px-2 py-1">The Eagles</td>
              <td className="px-2 py-1">1972</td>
            </tr>
            <tr className="border-b border-slate-600">
              <td className="px-2 py-1">Shining Star</td>
              <td className="px-2 py-1">Earth, Wind, and Fire</td>
              <td className="px-2 py-1">1975</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-center text-white rounded-md p-2 items-center">
        <p className="px-2">Rows per page:</p>
        <div className="px-2">
          <button>
            <select
              className="cursor-pointer p-1 bg-slate-700 rounded"
              name="number-of-rows"
              id="number-of-rows"
            >
              <option className="cursor-pointer" value="5">
                5
              </option>
              <option className="cursor-pointer" value="10">
                10
              </option>
            </select>
          </button>
        </div>

        <p className="px-2">1-5 of 100</p>
        <div className="flex px-2">
          <PrevPageButton />
          <NextPageButton />
        </div>
      </div>
    </div>
  );
}
