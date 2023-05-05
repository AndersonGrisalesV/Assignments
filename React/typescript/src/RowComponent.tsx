import PropTypes from "prop-types";

// type RowProps = InferProps<typeof RowComponent.propTypes>;

const RowComponent = ({
  id,
  name,
  email,
  university,
  gender,
  age,
}: {
  id: number;
  name: string;
  email: string;
  university: string;
  gender: string;
  age: number;
}) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>
        <a href={`mailto:${email}`} style={{ color: "#00a2ed" }}>
          {email}
        </a>
      </td>
      <td>{university}</td>
      <td>{gender}</td>
      <td>{age}</td>
    </tr>
  );
};

RowComponent.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  university: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
};

export default RowComponent;
