
declare function load(source: string | Packages.java.io.File | Packages.java.net.URL): void;
declare function loadWithNewGlobal(source: string | Packages.java.io.File | Packages.java.net.URL, arguments: any): void;
// These two are commented out because it's useless, doesn't even show in game log
// declare function print(...arg: any[]): void;
// declare function printErr(...arg: any[]): void;

/**
 * Information about the graal runner.
 */
declare namespace Graal {

    export const language: string;
    export const versionGraalVM: string;
    export const versionECMAScript: number;

    export function isGraalRuntime(): boolean;

}

declare namespace Polyglot {

    function _import(key: string): any;
    function _export(key: string, value: any): void;
    export function eval(languageId: string, sourceCode: string): any;
    export function evalFile(languageId: string, sourceFileName: string): () => any;

    export { _import as import };
    export { _export as export };

}

/**
 * Java namespace for graal's Java functions.
 */
declare namespace Java {

    // don't touch this order unless you know what you're doing
    // it's for optimizing, prevent it from flattening package if only the return type is needed
    export function type<C extends string>(className: C): GetJavaType<C>;
    export function type<C extends JavaTypeList>(className: C): GetJavaType<C>;
    export function from<T>(javaData: JavaArray<T>): T[];
    export function from<T>(javaData: JavaList<T>): T[];
    export function from<T>(javaData: JavaCollection<T>): T[];
    export function to<T>(jsArray: T[]): JavaArray<T>;
    export function to<T extends JavaObject>(jsData: object, toType: JavaClass<T>): T; // does this really exist
    export function isJavaObject(obj: JavaObject): boolean;
    export function isType(obj: JavaClass): boolean;
    export function typeName(obj: JavaObject): string | undefined;
    export function isJavaFunction(fn: JavaObject): boolean;
    export function isScriptObject(obj: any): boolean;
    export function isScriptFunction(fn: Function): boolean;
    export function addToClasspath(location: string): void;

}

type JavaTypeList = ListPackages<typeof Packages> | string & {};

type ListPackages<T extends object, P extends string = ''> =
    IsStrictAny<T> extends true ? never : IsConstructor<T> extends true ? P :
    { [K in keyof T]: ListPackages<T[K], P extends '' ? K : `${P}.${K}`> }[keyof T];

type GetJavaType<P extends string, T extends object = typeof Packages> =
    IsStrictAny<T> extends true ? unknown :
    P extends `${infer K}.${infer R}` ? GetJavaType<R, T[K]> :
    P extends '' ? IsConstructor<T> extends true ? T : unknown : GetJavaType<'', T[P]>;

type GetJavaTypeClass<T> = GetJavaType<T> extends infer J extends object ?
    IsStrictAny<J['class']> extends true ? unknown : J['class'] : unknown;

type BooStrNumMethod<T> = // Used in worldscanner
    { [K in keyof T]: ReturnType<T[K]> extends infer R extends boolean | string | number ?
    IsStrictAny<R> extends true ? never : K : never }[keyof T];

type IsConstructor<T> = T extends new (...args: never) => any ? true : false;

type IsStrictAny<T> = 0 | 1 extends (T extends never ? 1 : 0) ? true : false;

/** One of the root packages in java. */
declare const java:   JavaPackage<typeof Packages.java>;
/** One of the root packages in java. */
declare const javafx: JavaPackage<typeof Packages.javafx>;
/** One of the root packages in java. */
declare const javax:  JavaPackage<typeof Packages.javax>;
/** One of the root packages in java. */
declare const com:    JavaPackage<typeof Packages.com>;
/** One of the root packages in java. */
declare const org:    JavaPackage<typeof Packages.org>;
/** One of the root packages in java. */
declare const edu:    JavaPackage<typeof Packages.edu>;

type JavaPackage<T> = (IsStrictAny<T> extends true ? unknown : T) & {
    /** java package, no constructor */
    new (none: never): never;
    /** @deprecated */ Symbol: unknown;
    /** @deprecated */ apply: unknown;
    /** @deprecated */ arguments: unknown;
    /** @deprecated */ bind: unknown;
    /** @deprecated */ call: unknown;
    /** @deprecated */ caller: unknown;
    /** @deprecated */ length: unknown;
    /** @deprecated */ name: unknown;
    /** @deprecated */ prototype: unknown;
};

type JavaInterfaceStatics = {
    readonly class: JavaClass;
    /** interface, no constructor */
    new (none: never): never;
    /** @deprecated */ Symbol: unknown;
    /** @deprecated */ apply: unknown;
    /** @deprecated */ arguments: unknown;
    /** @deprecated */ bind: unknown;
    /** @deprecated */ call: unknown;
    /** @deprecated */ caller: unknown;
    /** @deprecated */ length: unknown;
    /** @deprecated */ name: unknown;
    /** @deprecated */ prototype: unknown;
};

type JavaClassStatics<
        Constructs extends false | object | [object],
        Args extends [] | [any, ...any] = []> =
    JavaClassConstructor<Constructs, Args> & {
        readonly class: JavaClass
        & (Constructs extends false ? unknown : JavaClassConstructor<Constructs, Args>);
    };

type JavaClassConstructor<
        Constructs extends false | object | [object],
        Args extends [] | [any, ...any] = []> =
    Constructs extends [infer O extends object] ?
        Args extends [any, ...any] ? {
            new (...args: Args): O;
            /** @deprecated */ Symbol: unknown;
            /** @deprecated */ apply: unknown;
            /** @deprecated */ arguments: unknown;
            /** @deprecated */ bind: unknown;
            /** @deprecated */ call: unknown;
            /** @deprecated */ caller: unknown;
            /** @deprecated */ length: unknown;
            /** @deprecated */ name: unknown;
            /** @deprecated */ prototype: unknown;
        } : {
            new (): O;
            /** @deprecated */ Symbol: unknown;
            /** @deprecated */ apply: unknown;
            /** @deprecated */ arguments: unknown;
            /** @deprecated */ bind: unknown;
            /** @deprecated */ call: unknown;
            /** @deprecated */ caller: unknown;
            /** @deprecated */ length: unknown;
            /** @deprecated */ name: unknown;
            /** @deprecated */ prototype: unknown;
        } : 
    Constructs extends false ? {
        /** no constructor */
        new (none: never): never;
        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
    } : Constructs;

/**
 * The global `Packages` object is provided by the GraalVM JavaScript engine, and allows
 * access to Java packages. Use it to interact with Java APIs and libraries from your
 * JavaScript code.
 *
 * To access a Java package, use the `Packages` object as a namespace, followed by the
 * fully-qualified package name. For example: `Packages.java.net.URL`.
 */
declare namespace Packages {

    namespace java {

        namespace lang {

            // https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Class.html
            const Class: JavaClassStatics<false> & {

                forName<C extends string>(className: C): GetJavaTypeClass<C>;
                forName<C extends JavaTypeList>(className: C): GetJavaTypeClass<C>;
                forName<C extends string>(name: C, initialize: boolean, loader: ClassLoader): GetJavaTypeClass<C>;
                forName<C extends JavaTypeList>(name: C, initialize: boolean, loader: ClassLoader): GetJavaTypeClass<C>;
                forName<C extends string>(module: Module, name: C): GetJavaTypeClass<C>;
                forName<C extends JavaTypeList>(module: Module, name: C): GetJavaTypeClass<C>;

            };
            interface Class<T> extends Object {

                arrayType(): Class<any>;
                asSubclass(clazz: Class<any>): Class<any>;
                cast(obj: Object): T;
                componentType(): Class<any>;
                descriptorString(): string;
                desiredAssertionStatus(): boolean;
                getAnnotatedInterfaces(): reflect.AnnotatedType[];
                getAnnotatedSuperclass(): reflect.AnnotatedType;
                getAnnotation<A extends annotation.Annotation>(annotationClass: Class<A>): A;
                getAnnotations(): annotation.Annotation[];
                getAnnotationsByType<A extends annotation.Annotation>(annotationClass: Class<A>): A[];
                getCanonicalName(): string;
                getClasses(): Class<any>[];
                getClassLoader(): ClassLoader;
                getComponentType(): Class<any>;
                getConstructor(...parameterTypes: Class<any>): reflect.Constructor<T>;
                getConstructors(): reflect.Constructor<any>[];
                getDeclaredAnnotation<A extends annotation.Annotation>(annotationClass: Class<A>): A;
                getDeclaredAnnotations(): annotation.Annotation[];
                getDeclaredAnnotationsByType<A extends annotation.Annotation>(annotationClass: Class<A>): A[];
                getDeclaredClasses(): Class<any>[];
                getDeclaredConstructor(...parameterTypes: Class<any>): reflect.Constructor<T>;
                getDeclaredConstructors(): reflect.Constructor<any>[];
                getDeclaredField(name: string): reflect.Field;
                getDeclaredFields(): reflect.Field[];
                getDeclaredMethod(name: string, ...parameterTypes: Class<any>): reflect.Method;
                getDeclaredMethods(): reflect.Method[];
                getDeclaringClass(): Class<any>;
                getEnclosingClass(): Class<any>;
                getEnclosingConstructor(): reflect.Constructor<any>;
                getEnclosingMethod(): reflect.Method;
                getEnumConstants(): T[];
                getField(name: string): reflect.Field;
                getFields(): reflect.Field[];
                getGenericInterfaces(): reflect.Type[];
                getGenericSuperclass(): reflect.Type;
                getInterfaces(): Class<any>[];
                getMethod(name: string, ...parameterTypes: Class<any>): reflect.Method;
                getMethods(): reflect.Method[];
                getModifiers(): number;
                getModule(): Module;
                getName(): string;
                getNestHost(): Class<any>;
                getNestMembers(): Class<any>[];
                getPackage(): Package;
                getPackageName(): string;
                getPermittedSubclasses(): Class<any>[];
                getProtectionDomain(): java.security.ProtectionDomain;
                getRecordComponents(): any; // reflect.RecordComponent[];
                getResource(name: string): java.net.URL;
                getResourceAsStream(name: string): java.io.InputStream;
                getSigners(): Object[];
                getSimpleName(): string;
                getSuperclass(): Class<any>;
                getTypeName(): string;
                getTypeParameters(): reflect.TypeVariable<Class<T>>[];
                isAnnotation(): boolean;
                isAnnotationPresent<T extends annotation.Annotation>(annotationClass: Class<T>): boolean;
                isAnonymousClass(): boolean;
                isArray(): boolean;
                isAssignableFrom(cls: Class<any>): boolean;
                isEnum(): boolean;
                isHidden(): boolean;
                isInstance(obj: Object): boolean;
                isInterface(): boolean;
                isLocalClass(): boolean;
                isMemberClass(): boolean;
                isNestmateOf(c: Class<any>): boolean;
                isPrimitive(): boolean;
                isRecord(): boolean;
                isSealed(): boolean;
                isSynthetic(): boolean;
                /** @deprecated */
                newInstance(): T;
                toGenericString(): string;
                toString(): string;

            }

            const Object: JavaClassStatics<[JavaObject]>;
            interface Object {

                equals(obj: JavaObject): boolean;
                getClass(): JavaClass<any>;
                hashCode(): number;
                notify(): void;
                notifyAll(): void;
                toString(): string;
                wait(): void;
                wait(var1: number): void;
                wait(timeoutMillis: number, nanos: number): void;

            }

            const Comparable: JavaInterfaceStatics;
            interface Comparable<T> extends Object {

                compareTo(arg0: T): number;

            }

            const Array: JavaInterfaceStatics;
            interface Array<T> extends Object, JsArray<T> {}

            const StackTraceElement: JavaClassStatics<{

                new (declaringClass: string, methodName: string, fileName: string, lineNumber: number): StackTraceElement;
                new (classLoaderName: string, moduleName: string, moduleVersion: string, declaringClass: string, methodName: string, fileName: string, lineNumber: number): StackTraceElement;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;

            }>;
            interface StackTraceElement extends Object, java.io.Serializable {

                getFileName(): string;
                getLineNumber(): number;
                getClassName(): string;
                getMethodName(): string;
                isNativeMethod(): boolean;
                toString(): string;
                equals(arg0: any): boolean;
                hashCode(): number;

            }

            const Throwable: JavaClassStatics<{

                new (): Throwable;
                new (message: string): Throwable;
                new (message: string, cause: Throwable): Throwable;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;

            }>;
            interface Throwable extends Object, java.io.Serializable, Error {

                getMessage(): string;
                getLocalizedMessage(): string;
                getCause(): Throwable;
                initCause(arg0: Throwable): Throwable;
                toString(): string;
                fillInStackTrace(): Throwable;
                getStackTrace(): Array<StackTraceElement>;
                setStackTrace(arg0: Array<StackTraceElement>): void;
                addSuppressed(arg0: Throwable): void;
                getSuppressed(): Array<Throwable>;

            }

            const Iterable: JavaInterfaceStatics;
            interface Iterable<T> extends Object, JsIterable<T> {

                iterator(): java.util.Iterator<T>;
                forEach(arg0: java.util.function.Consumer<any>): void;
                spliterator(): java.util.Spliterator<T>;

            }

            export { Class, Object, Comparable, Array, StackTraceElement, Throwable, Iterable };

        }

        namespace util {

            // https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Collection.html
            const Collection: JavaInterfaceStatics;
            interface Collection<T> extends java.lang.Iterable<T> {

                readonly [n: number]: T;

                add(element: T): boolean;
                addAll(elements: JavaCollection<T>): boolean;
                clear(): void;
                contains(element: T): boolean;
                containsAll(elements: JavaCollection<T>): boolean;
                equals(object: JavaCollection<T>): boolean;
                hashCode(): number;
                isEmpty(): boolean;
                iterator(): Iterator<T>;
                remove(element: T): boolean;
                removeAll(elements: JavaCollection<T>): boolean;
                retainAll(elements: JavaCollection<T>): boolean;
                size(): number;
                toArray(): T[];

            }

            // https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html
            const List: JavaClassStatics<false> & {

                copyOf<T>(coll: JavaCollection<T>): JavaList<T>;
                of<T>(...elements: T[]): JavaList<T>;

            };
            interface List<T> extends Collection<T> {

                add(index: number, element: T): void;
                add(element: T): boolean;
                addAll(index: number, elements: JavaCollection<T>): boolean;
                addAll(elements: JavaCollection<T>): boolean;
                get(index: number): T;
                indexOf(element: T): number;
                lastIndexOf(element: T): number;
                remove(index: number): T;
                remove(element: T): boolean;
                set(index: number, element: T): T;
                subList(start: number, end: number): JavaList<T>;

            }

            // https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html
            const Map: JavaClassStatics<false> & {

                copyOf<K, V>(map: JavaMap<K, V>): JavaMap<K, V>;
                entry<K, V>(k: K, v: V): Map$Entry<K, V>;
                ofEntries<K, V>(...entries: Map$Entry<K, V>[]): JavaMap<K, V>;
                of<K, V>(k1: K, v1: V): JavaMap<K, V>;
                of<K, V>(k1: K, v1: V, k2: K, v2: V): JavaMap<K, V>;
                of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V): JavaMap<K, V>;
                of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V): JavaMap<K, V>;
                of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V, k5: K, v5: V): JavaMap<K, V>;
                of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V, k5: K, v5: V, k6: K, v6: V): JavaMap<K, V>;
                of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V, k5: K, v5: V, k6: K, v6: V, k7: K, v7: V): JavaMap<K, V>;
                of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V, k5: K, v5: V, k6: K, v6: V, k7: K, v7: V, k8: K, v8: V): JavaMap<K, V>;
                of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V, k5: K, v5: V, k6: K, v6: V, k7: K, v7: V, k8: K, v8: V, k9: K, v9: V): JavaMap<K, V>;
                of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V, k5: K, v5: V, k6: K, v6: V, k7: K, v7: V, k8: K, v8: V, k9: K, v9: V, k10: K, v10: V): JavaMap<K, V>;

            };
            interface Map<K, V> extends JavaObject, Record<string | number, V> {

                clear(): void;
                containsKey(key: K): boolean;
                containsValue(value: V): boolean;
                entrySet(): JavaSet<Map$Entry<K, V>>;
                equals(object: JavaMap<K, V>): boolean;
                get(key: K): V | null;
                getOrDefault(key: K, defaultValue: V): V;
                hashCode(): number;
                isEmpty(): boolean;
                keySet(): JavaSet<K>;
                put(ket: K, value: V): V;
                putAll(map: JavaMap<K, V>): void;
                putIfAbsent(key: K, value: V): V | null;
                remove(key: K): V | null;
                remove(key: K, value: V): boolean;
                replace(key: K, value: V): V;
                replace(key: K, oldValue: V, newValue: V): boolean;
                size(): number;
                values(): JavaCollection<V>;

            }

            // https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html
            const Set: JavaClassStatics<false> & {

                copyOf<T>(coll: JavaCollection<T>): JavaSet<T>;
                of<T>(...elements: T[]): JavaSet<T>;

            };
            interface Set<T> extends Collection<T> {}

            export { Collection, List, Map, Set };

        }

        namespace io {

            const File: JavaClassStatics<{

                new (pathName: string): File;
                new (parent: string, child: string): File;
                new (parent: File, child: string): File;
                new (uri: java.net.URI): File;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;

            }> & {

                listRoots(): JavaArray<File>;

            };
            interface File extends JavaObject {

                canExecute(): boolean;
                canRead(): boolean;
                canWrite(): boolean;
                createNewFile(): boolean;
                delete(): boolean;
                deleteOnExit(): void;
                exists(): boolean;
                getAbsolutePath(): string;
                getCanonicalPath(): string;
                getName(): string;
                getParent(): string;
                getPath(): string;
                isAbsolute(): boolean;
                isDirectory(): boolean;
                isFile(): boolean;
                isHidden(): boolean;
                length(): number;
                list(): JavaArray<string>;
                listFiles(): JavaArray<File>;
                mkdir(): boolean;
                mkdirs(): boolean;
                renameTo(dest: File): boolean;
                setExecutable(executable: boolean, ownerOnly?: boolean): boolean;
                setLastModified(time: number): boolean;
                setReadable(readable: boolean, ownerOnly?: boolean): boolean;
                setWritable(writable: boolean, ownerOnly?: boolean): boolean;
                toString(): string;
                toURI(): java.net.URI;

            }

            const Serializable: JavaInterfaceStatics;
            interface Serializable extends JavaObject {}

            export { File, Serializable };

        }

        namespace net {

            const URL: JavaClassStatics<{

                new (protocol: string, host: string, port: number, file: string): URL;
                new (protocol: string, host: string, file: string): URL;
                new (spec: string): URL;
                new (context: URL, spec: string): URL;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;

            }>;
            interface URL extends JavaObject {

                getFile(): string;
                getPath(): string;
                getProtocol(): string;
                getRef(): string;
                getQuery(): string;
                toString(): string;
                toURI(): URI;

            }

            const URI: JavaClassStatics<{

                new (str: string): URI;
                new (scheme: string, userInfo: string, host: string, port: number, path: string, query: string, fragment: string): URI;
                new (scheme: string, authority: string, path: string, query: string, fragment: string): URI;
                new (scheme: string, host: string, path: string, fragment: string): URI;
                new (scheme: string, ssp: string, fragment: string): URI;
                new (scheme: string, path: string): URI;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;

            }> & {

                create(str: string): URI;

            };
            interface URI extends java.lang.Comparable<URI>, java.io.Serializable {

                getHost(): string;
                getPath(): string;
                getPort(): number;
                getQuery(): string;
                getScheme(): string;
                normalize(): URI;
                relativize(uri: URI): URI;
                resolve(str: string): URI;
                toASCIIString(): string;
                toString(): string;
                toURL(): URL;

            }

            export { URL, URI };

        }

    }

    // remove this if someone made a d.ts for minecraft classes
    namespace net {

        export const minecraft: any;

    }

}

type JsArray<T> = T[];
type JsIterable<T> = Iterable<T>;

type JavaObject                = Packages.java.lang.Object;
type JavaClass<T = any>        = Packages.java.lang.Class<T>;
type JavaArray<T = any>        = Packages.java.lang.Array<T>;
type JavaCollection<T = any>   = Packages.java.util.Collection<T>;
type JavaList<T = any>         = Packages.java.util.List<T>;
type JavaSet<T = any>          = Packages.java.util.Set<T>;
type JavaMap<K = any, V = any> = Packages.java.util.Map<K, V>;
