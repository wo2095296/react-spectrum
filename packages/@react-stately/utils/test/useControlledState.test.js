import {act, renderHook} from 'react-hooks-testing-library';
import {useControlledState} from '../src';

describe('useControlledState tests', function () {
  it('can handle default setValue behavior', () => {
    let onChangeSpy = jest.fn();
    let {result} = renderHook(() => useControlledState(undefined, 'defaultValue', onChangeSpy));
    let [value, setValue] = result.current;
    expect(value).toBe('defaultValue');
    expect(onChangeSpy).not.toHaveBeenCalled();
    act(() => setValue('newValue'));
    [value, setValue] = result.current;
    expect(value).toBe('newValue');
    expect(onChangeSpy).toHaveBeenCalledWith('newValue');
  });

  it('can handle callback setValue behavior', () => {
    let onChangeSpy = jest.fn();
    let {result} = renderHook(() => useControlledState(undefined, 'defaultValue', onChangeSpy));
    let [value, setValue] = result.current;
    expect(value).toBe('defaultValue');
    expect(onChangeSpy).not.toHaveBeenCalled();
    act(() => setValue((prevValue) => {
      expect(prevValue).toBe('defaultValue');
      return 'newValue';
    }));
    [value, setValue] = result.current;
    expect(value).toBe('newValue');
    expect(onChangeSpy).toHaveBeenCalledWith('newValue');
  });

  it('can handle controlled setValue behavior', () => {
    let onChangeSpy = jest.fn();
    let {result} = renderHook(() => useControlledState('controlledValue', 'defaultValue', onChangeSpy));
    let [value, setValue] = result.current;
    expect(value).toBe('controlledValue');
    expect(onChangeSpy).not.toHaveBeenCalled();
    act(() => setValue('newValue'));
    [value, setValue] = result.current;
    expect(value).toBe('controlledValue');
    expect(onChangeSpy).toHaveBeenCalledWith('newValue');
  });

  it('can handle controlled callback setValue behavior', () => {
    let onChangeSpy = jest.fn();
    let {result} = renderHook(() => useControlledState('controlledValue', 'defaultValue', onChangeSpy));
    let [value, setValue] = result.current;
    expect(value).toBe('controlledValue');
    expect(onChangeSpy).not.toHaveBeenCalled();
    act(() => setValue((prevValue) => {
      expect(prevValue).toBe('controlledValue');
      return 'newValue';
    }));
    [value, setValue] = result.current;
    expect(value).toBe('controlledValue');
    expect(onChangeSpy).toHaveBeenCalledWith('newValue');
  });

  it('will console warn if the programmer tries to switch from controlled to uncontrolled', () => {
    let onChangeSpy = jest.fn();
    let consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    let {result, rerender} = renderHook(
      ({value, defaultValue, onChange}) => useControlledState(value, defaultValue, onChange),
      {
        initialProps: {
          value: 'controlledValue',
          defaultValue: 'defaultValue',
          onChange: onChangeSpy
        }
      }
    );
    let [value] = result.current;
    expect(value).toBe('controlledValue');
    expect(onChangeSpy).not.toHaveBeenCalled();
    rerender({value: undefined, defaultValue: 'defaultValue', onChange: onChangeSpy});
    expect(consoleWarnSpy).toHaveBeenCalledWith('WARN: A component changed from controlled to uncontrolled.');
  });

  it('will console warn if the programmer tries to switch from uncontrolled to controlled', () => {
    let onChangeSpy = jest.fn();
    let consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    let {result, rerender} = renderHook(
      ({value, defaultValue, onChange}) => useControlledState(value, defaultValue, onChange),
      {
        initialProps: {
          value: undefined,
          defaultValue: 'defaultValue',
          onChange: onChangeSpy
        }
      }
    );
    let [value] = result.current;
    expect(value).toBe('defaultValue');
    expect(onChangeSpy).not.toHaveBeenCalled();
    rerender({value: 'controlledValue', defaultValue: 'defaultValue', onChange: onChangeSpy});
    expect(consoleWarnSpy).toHaveBeenCalledWith('WARN: A component changed from uncontrolled to controlled.');
  });
});
