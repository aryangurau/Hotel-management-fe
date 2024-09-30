const TableLoader = () => {
    return (
      <>
        <tr className="placeholder-glow">
          <th scope="row">
            <span className="placeholder col-6"></span>
          </th>
          <td>
            <span className="placeholder col-6"></span>
          </td>
          <td>
            <span className="placeholder col-6"></span>
          </td>
          <td>
            <span className="placeholder col-6"></span>
          </td>
          <td>
            <span className="placeholder col-6"></span>
          </td>
          <td>
            <span className="placeholder col-6"></span>
          </td>
          <td>
            <span className="placeholder col-6"></span>
          </td>
          <td>
            <div className="btn-group me-2" role="button">
              <i className="bi bi-pencil-square text-success"></i>
            </div>
            <div className="btn-group" role="button">
              <i className="bi bi-trash text-danger"></i>
            </div>
          </td>
        </tr>
      </>
    );
  };
  
  export default TableLoader;