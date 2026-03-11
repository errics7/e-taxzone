export default function RowBukuBesarGs2(props) {
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  const { nominal } = props;

  return (
    <tr>
      <td className="min-w-10v max-w-10v border py-3">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="w-1/2 border-r text-center">Des</td>
              <td className="w-1/2 border-l text-center">1</td>
            </tr>
          </tbody>
        </table>
      </td>
      <td className="min-w-10v max-w-10v border py-3 text-center">
        Saldo awal
      </td>
      <td className="min-w-15v max-w-15v border py-3 text-center">NA</td>
      <td className="min-w-15v max-w-15v border py-3">&nbsp;</td>
      <td className="min-w-15v max-w-15v border py-3">&nbsp;</td>
      <td className="min-w-15v max-w-15v border py-3 text-center bg-amber-100">
        {toRp(nominal)}
      </td>
    </tr>
  );
}
