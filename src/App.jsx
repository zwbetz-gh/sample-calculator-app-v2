import React from 'react';
import './App.css';
import {useForm} from 'react-hook-form';

function App() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors}
  } = useForm();

  const [loading, setLoading] = React.useState(true);
  const [number1Disabled, setNumber1Disabled] = React.useState(true);
  const [number2Disabled, setNumber2Disabled] = React.useState(true);
  const [operationDisabled, setOperationDisabled] = React.useState(true);

  const DELAY_IN_SECONDS = 3;

  const spinner = (
    <div>
      <div>
        <div class="d-flex align-items-center">
          <strong>
            Artificially disabling fields for {DELAY_IN_SECONDS} seconds...
          </strong>
          <div
            class="spinner-border"
            style={{marginLeft: '0.5rem'}}
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      </div>
    </div>
  );

  const requiredAsterisk = <span className="custom-required">*</span>;

  const operationToAction = {
    '+': (number1, number2) => number1 + number2,
    '-': (number1, number2) => number1 - number2,
    '*': (number1, number2) => number1 * number2,
    '/': (number1, number2) => number1 / number2
  };

  const enableFields = () => {
    setNumber1Disabled(false);
    setNumber2Disabled(false);
    setOperationDisabled(false);
  };

  const createRequiredMessage = (name, label) => {
    return (
      <p id={`${name}Error`} className="custom-error">
        {label} is required
      </p>
    );
  };

  const onSubmit = (data) => {
    const number1 = Number(data.number1);
    const number2 = Number(data.number2);
    const {operation} = data;
    const action = operationToAction[operation];
    const result = action(number1, number2);
    setValue('result', result);
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
      enableFields();
    }, DELAY_IN_SECONDS * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="container custom-container">
      <h1 className="custom-h1">{process.env.REACT_APP_TITLE}</h1>

      {loading && spinner}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="number1" className="form-label">
            Number 1 {requiredAsterisk}
          </label>
          <input
            id="number1"
            type="number"
            className="form-control"
            disabled={number1Disabled}
            {...register('number1', {required: true})}
          />
          {errors.number1 && createRequiredMessage('number1', 'Number 1')}
        </div>

        <div className="mb-3">
          <label htmlFor="number2" className="form-label">
            Number 2 {requiredAsterisk}
          </label>
          <input
            id="number2"
            type="number"
            className="form-control"
            disabled={number2Disabled}
            {...register('number2', {required: true})}
          />
          {errors.number2 && createRequiredMessage('number2', 'Number 2')}
        </div>

        <div className="mb-3">
          <label htmlFor="operation" className="form-label">
            Operation {requiredAsterisk}
          </label>
          <select
            id="operation"
            defaultValue=""
            className="form-control"
            disabled={operationDisabled}
            {...register('operation', {required: true})}
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
          </select>
          {errors.operation && createRequiredMessage('operation', 'Operation')}
        </div>

        <div className="mb-3">
          <label htmlFor="result" className="form-label">
            Result
          </label>
          <input
            id="result"
            type="number"
            className="form-control"
            readOnly
            {...register('result')}
          />
        </div>

        <button
          id="submit"
          type="submit"
          className="btn btn-primary custom-button"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
