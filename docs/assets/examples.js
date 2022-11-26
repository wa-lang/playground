const LICENSE = `# 版权 @2019 凹语言 作者。保留所有权利。
`;

const EG_HELLO = `${LICENSE}
import "fmt"
import "runtime"

fn main {
	println("你好，凹语言！", runtime.WAOS)
	println(add(40, 2))

	fmt.Println(1+1)
}

fn add(a: i32, b: i32) => i32 {
	return a+b
}
`

const EG_HEART = `${LICENSE}
fn main() {
  a := 0.0
  for y := 1.5; y > -1.5; y = y - 0.15 {
    for x := -1.5; x < 1.5; x = x + 0.07 {
      a = x*x + y*y - 1.0
      if a*a*a < x*x*y*y*y {
        print("@")
      } else {
        print(" ")
      }
    }
    println()
  }
}
`

const EG_COUNT = `${LICENSE}
fn main() {
  print("30以内的质数：")
	for n := 2; n <= 30; n = n + 1 {
		var isPrime int = 1
		for i := 2; i*i <= n; i = i + 1 {
			if x := n % i; x == 0 {
				isPrime = 0
			}
		}
		if isPrime != 0 {
			print(n)
      if n != 29 {
        print("、")
      }
		}
	}
}
`
