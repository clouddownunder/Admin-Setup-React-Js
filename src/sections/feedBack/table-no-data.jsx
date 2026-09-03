import PropTypes from "prop-types";

// ----------------------------------------------------------------------

export default function TableNoData({ query }) {
  return (
    <tr>
      <td colSpan={12} className="text-center py-4">
        <div className="bg-white rounded p-3 dt-not-found">
          <h6 className="mb-2">Not found</h6>

          <p className="mb-0 text-muted">
            No results found for <strong>&quot;{query}&quot;</strong>.
          </p>
        </div>
      </td>
    </tr>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
};
