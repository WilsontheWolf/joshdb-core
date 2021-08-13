import { Stopwatch } from '@sapphire/stopwatch';
import { MapProvider, Method, Payload } from '../../../src';

const provider = new MapProvider({ name: 'tests' });

describe('MapProvider class', () => {
	describe('Initialization', () => {
		test('GIVEN init() THEN returns true', () => {
			void expect(provider.init()).resolves.toBe(true);
		});

		test('GIVEN name THEN returns provider name', () => {
			expect(provider.name).toBe('tests');
		});
	});

	describe('Payload validation', () => {
		test('GIVEN autoKey() THEN returns payload for autoKey', () => {
			const { method, trigger, stopwatch, data } = provider.autoKey({ method: Method.AutoKey, data: '' });

			expect(method).toBe(Method.AutoKey);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(data).toBe('1');
		});

		test('GIVEN delete() THEN returns payload for delete', () => {
			const { method, trigger, stopwatch, key, path } = provider.delete({ method: Method.Delete, key: 'test' });

			expect(method).toBe(Method.Delete);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(key).toBe('test');
			expect(path).toBeUndefined();
		});

		test('GIVEN ensure() THEN returns payload for ensure', () => {
			const { method, trigger, stopwatch, key, data, defaultValue } = provider.ensure({
				method: Method.Ensure,
				key: 'test',
				data: 'test',
				defaultValue: 'test'
			});

			expect(method).toBe(Method.Ensure);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(key).toBe('test');
			expect(data).toBe('test');
			expect(defaultValue).toBe('test');
		});

		test('GIVEN filterByData() THEN returns payload for filterByData', () => {
			const { method, trigger, stopwatch, path, inputData, data } = provider.filterByData({
				method: Method.Filter,
				type: Payload.Type.Data,
				inputData: 'test',
				data: {}
			});

			expect(method).toBe(Method.Filter);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(path).toBeUndefined();
			expect(inputData).toBe('test');
			expect(data).toEqual({ test: 'test' });
		});

		test('GIVEN filterByHook() THEN returns payload for filterByHook', async () => {
			const { method, trigger, stopwatch, path, inputHook, data } = await provider.filterByHook({
				method: Method.Filter,
				type: Payload.Type.Hook,
				inputHook: (data) => data === 'test',
				data: {}
			});

			expect(method).toBe(Method.Filter);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(path).toBeUndefined();
			expect(typeof inputHook).toBe('function');
			expect(data).toEqual({ test: 'test' });
		});

		test('GIVEN findByData() THEN returns payload for findByData', () => {
			const { method, trigger, stopwatch, path, inputData, data } = provider.findByData({
				method: Method.Find,
				type: Payload.Type.Data,
				inputData: 'test'
			});

			expect(method).toBe(Method.Find);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(path).toBeUndefined();
			expect(inputData).toBe('test');
			expect(data).toBe('test');
		});

		test('GIVEN findByHook() THEN returns payload for findByHook', () => {
			const { method, trigger, stopwatch, path, inputHook, data } = provider.findByHook({
				method: Method.Find,
				type: Payload.Type.Hook,
				inputHook: (data) => data === 'test'
			});

			expect(method).toBe(Method.Find);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(path).toBeUndefined();
			expect(typeof inputHook).toBe('function');
			expect(data).toBe('test');
		});

		test('GIVEN get() THEN returns payload for get', () => {
			const { method, trigger, stopwatch, key, path, data } = provider.get({
				method: Method.Get,
				key: 'test'
			});

			expect(method).toBe(Method.Get);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(key).toBe('test');
			expect(path).toBeUndefined();
			expect(data).toBe('test');
		});

		test('GIVEN getAll() THEN returns payload for getAll', () => {
			const { method, trigger, stopwatch, data } = provider.getAll({ method: Method.GetAll, data: {} });

			expect(method).toBe(Method.GetAll);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(data).toEqual({ test: 'test' });
		});

		test('GIVEN getMany() THEN returns payload for getMany', () => {
			const { method, trigger, stopwatch, keyPaths, data } = provider.getMany({ method: Method.GetMany, keyPaths: [['test', []]], data: {} });

			expect(method).toBe(Method.GetMany);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(keyPaths).toEqual([['test', []]]);
			expect(data).toEqual({ test: 'test' });
		});

		test('GIVEN has() THEN returns payload for has', () => {
			const { method, trigger, stopwatch, key, path, data } = provider.has({
				method: Method.Has,
				key: 'test',
				data: false
			});

			expect(method).toBe(Method.Has);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(key).toBe('test');
			expect(path).toBeUndefined();
			expect(data).toBe(true);
		});

		test('GIVEN keys() THEN returns payload for keys', () => {
			const { method, trigger, stopwatch, data } = provider.keys({ method: Method.Keys, data: [] });

			expect(method).toBe(Method.Keys);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(data).toEqual(['test']);
		});

		test('GIVEN random() THEN returns payload for random', () => {
			const { method, trigger, stopwatch, data } = provider.random({ method: Method.Random });

			expect(method).toBe(Method.Random);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(data).toBe('test');
		});

		test('GIVEN randomKey() THEN returns payload for randomKey', () => {
			const { method, trigger, stopwatch, data } = provider.randomKey({ method: Method.RandomKey });

			expect(method).toBe(Method.RandomKey);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(data).toBe('test');
		});

		test('GIVEN set() THEN returns payload for set', () => {
			const { method, trigger, stopwatch, key, path } = provider.set({ method: Method.Set, key: 'test' }, 'test');

			expect(method).toBe(Method.Set);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(key).toBe('test');
			expect(path).toBeUndefined();
		});

		test('GIVEN setMany() THEN returns payload for setMany', () => {
			const { method, trigger, stopwatch, keyPaths } = provider.setMany({ method: Method.SetMany, keyPaths: [['test', []]] }, 'test');

			expect(method).toBe(Method.SetMany);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(keyPaths).toEqual([['test', []]]);
		});

		test('GIVEN size() THEN returns payload for size', () => {
			const { method, trigger, stopwatch, data } = provider.size({ method: Method.Size, data: 0 });

			expect(method).toBe(Method.Size);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(data).toBe(1);
		});

		test('GIVEN updateByData() THEN returns payload for updateByData', () => {
			const { method, trigger, stopwatch, key, path, inputData, data } = provider.updateByData({
				method: Method.Update,
				key: 'test',
				type: Payload.Type.Data,
				inputData: 'test'
			});

			expect(method).toBe(Method.Update);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(key).toBe('test');
			expect(path).toBeUndefined();
			expect(inputData).toBe('test');
			expect(data).toBe('test');
		});

		test('GIVEN updateByHook() THEN returns payload for updateByHook', async () => {
			const { method, trigger, stopwatch, key, path, inputHook, data } = await provider.updateByHook({
				method: Method.Update,
				key: 'test',
				type: Payload.Type.Hook,
				inputHook: () => 'test'
			});

			expect(method).toBe(Method.Update);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(key).toBe('test');
			expect(path).toBeUndefined();
			expect(typeof inputHook).toBe('function');
			expect(data).toBe('test');
		});

		test('GIVEN values() THEN returns payload for values', () => {
			const { method, trigger, stopwatch, data } = provider.values({ method: Method.Values, data: [] });

			expect(method).toBe(Method.Values);
			expect(trigger).toBeUndefined();
			expect(stopwatch).toBeInstanceOf(Stopwatch);
			expect(data).toEqual(['test']);
		});
	});
});
