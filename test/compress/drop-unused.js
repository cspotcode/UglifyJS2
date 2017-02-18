unused_funarg_1: {
    options = { unused: true, keep_fargs: false };
    input: {
        function f(a, b, c, d, e) {
            return a + b;
        }
    }
    expect: {
        function f(a, b) {
            return a + b;
        }
    }
}

unused_funarg_2: {
    options = { unused: true, keep_fargs: false };
    input: {
        function f(a, b, c, d, e) {
            return a + c;
        }
    }
    expect: {
        function f(a, b, c) {
            return a + c;
        }
    }
}

unused_nested_function: {
    options = { unused: true };
    input: {
        function f(x, y) {
            function g() {
                something();
            }
            return x + y;
        }
    };
    expect: {
        function f(x, y) {
            return x + y;
        }
    }
}

unused_circular_references_1: {
    options = { unused: true };
    input: {
        function f(x, y) {
            // circular reference
            function g() {
                return h();
            }
            function h() {
                return g();
            }
            return x + y;
        }
    };
    expect: {
        function f(x, y) {
            return x + y;
        }
    }
}

unused_circular_references_2: {
    options = { unused: true };
    input: {
        function f(x, y) {
            var foo = 1, bar = baz, baz = foo + bar, qwe = moo();
            return x + y;
        }
    };
    expect: {
        function f(x, y) {
            moo();              // keeps side effect
            return x + y;
        }
    }
}

unused_circular_references_3: {
    options = { unused: true };
    input: {
        function f(x, y) {
            var g = function() { return h() };
            var h = function() { return g() };
            return x + y;
        }
    };
    expect: {
        function f(x, y) {
            return x + y;
        }
    }
}

unused_keep_setter_arg: {
    options = { unused: true };
    input: {
        var x = {
            _foo: null,
            set foo(val) {
            },
            get foo() {
                return this._foo;
            }
        }
    }
    expect: {
        var x = {
            _foo: null,
            set foo(val) {
            },
            get foo() {
                return this._foo;
            }
        }
    }
}

unused_var_in_catch: {
    options = { unused: true };
    input: {
        function foo() {
            try {
                foo();
            } catch(ex) {
                var x = 10;
            }
        }
    }
    expect: {
        function foo() {
            try {
                foo();
            } catch(ex) {}
        }
    }
}

used_var_in_catch: {
    options = { unused: true };
    input: {
        function foo() {
            try {
                foo();
            } catch(ex) {
                var x = 10;
            }
            return x;
        }
    }
    expect: {
        function foo() {
            try {
                foo();
            } catch(ex) {
                var x = 10;
            }
            return x;
        }
    }
}

keep_fnames: {
    options = { unused: true, keep_fnames: true, unsafe: true };
    input: {
        function foo() {
            return function bar(baz) {};
        }
    }
    expect: {
        function foo() {
            return function bar(baz) {};
        }
    }
}

drop_assign: {
    options = { unused: true };
    input: {
        function f1() {
            var a;
            a = 1;
        }
        function f2() {
            var a = 1;
            a = 2;
        }
        function f3(a) {
            a = 1;
        }
        function f4() {
            var a;
            return a = 1;
        }
        function f5() {
            var a;
            return function() {
                a = 1;
            }
        }
    }
    expect: {
        function f1() {
            1;
        }
        function f2() {
            2;
        }
        function f3(a) {
            1;
        }
        function f4() {
            return 1;
        }
        function f5() {
            var a;
            return function() {
                a = 1;
            }
        }
    }
}

keep_assign: {
    options = { unused: "keep_assign" };
    input: {
        function f1() {
            var a;
            a = 1;
        }
        function f2() {
            var a = 1;
            a = 2;
        }
        function f3(a) {
            a = 1;
        }
        function f4() {
            var a;
            return a = 1;
        }
        function f5() {
            var a;
            return function() {
                a = 1;
            }
        }
    }
    expect: {
        function f1() {
            var a;
            a = 1;
        }
        function f2() {
            var a = 1;
            a = 2;
        }
        function f3(a) {
            a = 1;
        }
        function f4() {
            var a;
            return a = 1;
        }
        function f5() {
            var a;
            return function() {
                a = 1;
            }
        }
    }
}

drop_toplevel_funcs: {
    options = { toplevel: "funcs", unused: true };
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a, b = 1, c = g;
        a = 2;
        function g() {}
        console.log(b = 3);
    }
}

drop_toplevel_vars: {
    options = { toplevel: "vars", unused: true };
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        2;
        function g() {}
        function h() {}
        console.log(3);
    }
}

drop_toplevel_vars_fargs: {
    options = { keep_fargs: false, toplevel: "vars", unused: true };
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var c = g;
        function f() {
            return function() {
                c = 2;
            }
        }
        2;
        function g() {}
        function h() {}
        console.log(3);
    }
}

drop_toplevel_all: {
    options = { toplevel: true, unused: true };
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        2;
        console.log(3);
    }
}

drop_toplevel_retain: {
    options = { top_retain: "f,a,o", unused: true };
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        console.log(3);
    }
}

drop_toplevel_retain_array: {
    options = { top_retain: [ "f", "a", "o" ], unused: true };
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        console.log(3);
    }
}

drop_toplevel_retain_regex: {
    options = { top_retain: /^[fao]$/, unused: true };
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        console.log(3);
    }
}

drop_toplevel_all_retain: {
    options = { toplevel: true, top_retain: "f,a,o", unused: true };
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        console.log(3);
    }
}

drop_toplevel_funcs_retain: {
    options = { toplevel: "funcs", top_retain: "f,a,o", unused: true };
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        console.log(b = 3);
    }
}

drop_toplevel_vars_retain: {
    options = { toplevel: "vars", top_retain: "f,a,o", unused: true };
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(3);
    }
}

drop_toplevel_keep_assign: {
    options = { toplevel: true, unused: "keep_assign" };
    input: {
        var a, b = 1, c = g;
        function f(d) {
            return function() {
                c = 2;
            }
        }
        a = 2;
        function g() {}
        function h() {}
        console.log(b = 3);
    }
    expect: {
        var a, b = 1;
        a = 2;
        console.log(b = 3);
    }
}

drop_fargs: {
    options = {
        keep_fargs: false,
        unused: true,
    }
    input: {
        function f(a) {
            var b = a;
        }
    }
    expect: {
        function f() {}
    }
}

drop_fnames: {
    options = {
        keep_fnames: false,
        unused: true,
    }
    input: {
        function f() {
            return function g() {
                var a = g;
            };
        }
    }
    expect: {
        function f() {
            return function() {};
        }
    }
}
