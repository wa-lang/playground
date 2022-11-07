const LICENSE = `# 版权 @2019 凹语言 作者。保留所有权利。
`;

const EG_HELLO = `${LICENSE}
fn main() {
  for r := 0; r <= 12; r++ { 
    for c := 0; c < 24; c++ {
      if r <= 3 {
        if c < 8 || c >= 16 {
          if r == 1 && (c == 3 || c == 19) {
            print('[')
          } else if r == 1 && (c == 4 || c == 20) { 
            print(']')
          } else {
            print('*')
          }
        } else {
          print(' ')
        }
      } else if 
        (r == 8 && c == 6) ||
        (r == 9 && c == 7) ||
        (r == 10 && c == 8) ||
        (r == 8 && c == 12) ||
        (r == 9 && c == 13) ||
        (r == 10 && c == 14) {
        print('\\\\')
      } else if
        (r == 8 && c == 17) ||
        (r == 9 && c == 16) ||
        (r == 10 && c == 15) ||
        (r == 8 && c == 11) ||
        (r == 9 && c == 10) ||
        (r == 10 && c == 9) {
        print('/')
      } else { 
        print('*')
      }
    }
    println()
  }
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
