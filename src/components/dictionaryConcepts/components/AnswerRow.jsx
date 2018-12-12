import React from 'react';

const answerRow = (props) => {
  const { display_name, handleAnswerChange, id } = props;
  return (
    <tr>
      <td>
        <input
          type="text"
          className="form-control"
          placeholder="eg. Malaria"
          name="display-name"
          disabled
          value={display_name}
          required
        />
      </td>
      <td>
        <select
          name="map_scope"
          className="form-control"
          onChange={event => handleAnswerChange(event, id)}
          required
        >
          <option>Internal</option>
          <option>External</option>
        </select>
      </td>
      <td>
        <select
          name="map_type"
          className="form-control"
          onChange={event => handleAnswerChange(event, id)}
          required
        >
          <option>Same as</option>
          <option>Narrower than</option>
        </select>
      </td>
    </tr>

  );
};

export default answerRow;
