This is my IB Math AA HL internal assessment. I wrote it on a fun topic about maximizing the chance of winning red envelopes on WeChat, and I received a score of 19/20.

# 1 Introduction

The red envelope is a popular feature on WeChat that allows users to send digital monetary gifts to friends or family, particularly during Chinese New Year and other celebrations ("WeChat red envelope"). In sending a red envelope in a group chat, the sender sets the total amount of money and the number of participants, after which WeChat's algorithm randomly distributes the money among the recipients. Like many others, receiving red envelopes on WeChat is the tradition I am most excited about each year during Chinese New Year. I've experienced moments when I am lucky enough to receive the highest amount in a group, while at other times, my luck semed to falter and I only received small amounts. This unpredictable nature of opening red envelopes on WeChat sparked my curiosity about its mechanism and the deeper principles behind the algorithm. As I researched this topic,I found that the amounts in red envelopes on WeChat aren't always evenly distributed; instead, WeChat employs a specific algorithm known as the“Double-Average Method" to assign amounts to participants (Tim). In the double-average method, the amount each participant receives is determined independently when they open the red envelope. The amount each participant receives sits randomly between 0.01? and double the average of the remaining amount. This ensures the expected value each participant receives is always the average of the total amount; however, the probability each participant becomes the luckiest, or the one who receives the highest amount, is not guaranteed to be the same regarding their order of opening the red envelope. This led to my research question: How does the opening order affect the probability of receiving the largest red envelope, and can one optimize their position to maximize the chances of being the luckiest? This exploration wil focus on statistics and probability as part of the IB Math curriculum. To answer the question, I will first formulate the problem using mathematical

language to describe how red envelopes are split based on the double-average method and reduce the problem into an easier version. Then,I will use statistics and probability theory to examine whether early or late openers have a higher chance of receiving the highest amount. Lastly, I will run a computer simulation to compare my theoretical predictions with the actual results. It is predicted that opening the envelope earlier is optimal with a small number of participants, and vice versa when the number of participants is bigger. The more detailed hypothesis is discussed in section 2.4.

# 2 Model Formulation and Theoretical Analysis

# 2.1 Variable and Function Definitions

Here are definitions of variables and functions that will later be used in this exploration:

<table><tr><td>Variable and function names</td><td>Definitions</td></tr><tr><td>n</td><td>The number of participants</td></tr><tr><td>X</td><td>The amount drawn by the ith participant (in monetary units)</td></tr><tr><td>R</td><td>The remaining amount after the ith draw (in monetary units)</td></tr><tr><td>P(x)</td><td>The probability that the event X happens</td></tr><tr><td>E(x)</td><td>The expected value of the random variable X</td></tr><tr><td>Var(x)</td><td>The variance of the random variable X</td></tr><tr><td>U(a，,b)</td><td>A continuous uniform distribution over the interval [a, b].</td></tr><tr><td>N(u，,0)</td><td>A normal distribution with mean μ and variance σ²</td></tr><tr><td></td><td>The proportion of the remaining balance allocated to the amount in the ith envelope</td></tr><tr><td>H n</td><td>The nth harmonic number</td></tr><tr><td>m</td><td>The required upper-tail fraction threshold of the first envelope&#x27;s distribution to win</td></tr></table>

Table 1: Variable and function definitions   

# 2.2 Problem Statement

In this exploration, the value of money is assumed to be continuous, without restricting it to two decimal places. The lower boundary of the amount range of each envelope is set to O instead of 0.01 for simple calculation purposes. These two simplifications have litle impact on the results, as minor rounding differences are negligible in the context of the analysis.

Under the double-average method:

·For the first $n - 1$ participants, the ith envelope amount $X _ { _ i }$ is chosen uniformly at random of $X _ { _ { i } } \sim U ( 0 , 2 a v g )$ , where avg is the average of the remaining envelopes, given with $\begin{array} { r } { a v g = \frac { R _ { i - 1 } } { n - i + 1 } } \end{array}$ (The remaining amount $R _ { i - 1 }$ over the remaining number of participants $n - i + 1 \nobreakspace$ ). Thus the random variable $X _ { _ i }$ can be expressed as

$$
\begin{array} { r } { X _ { i } \sim U ( 0 , \frac { 2 R _ { i - 1 } } { n - i + 1 } ) . } \end{array}
$$

·Specifically, define the initial total amount $R _ { 0 } = 1$ . For the first participant, substitute i with 1 and $R _ { i - 1 }$ with 1:

$$
\begin{array} { r } { X _ { 1 } \sim U ( 0 , \frac { 2 } { n } ) . } \end{array}
$$

•The last envelope is the leftover, such that

$$
X _ { _ n } = 1 - \sum _ { i = 1 } ^ { n - 1 } X _ { i } .
$$

As previously indicated in the Introduction section, the expected value of the amount received by each participant is the same such that $\begin{array} { r } { E ( X _ { 1 } ) = E ( X _ { 2 } ) = \quad \cdots = E ( X _ { n } ) = \frac { 1 } { n } . } \end{array}$ However, their probabilities of receiving the highest amount differ. Thus, the goal of this exploration is to determine:

In other words, we aim to find the optimal opening position $i$ that maximizes the probability of receiving the largest amount for different values of $n$

# 2.3 Problem Reduction

We consider $n$ participants in a WeChat red envelope game. Instead of analyzing all possible positions, we'll only focus only on the first and last participants, as the participant receiving the highest amount is always among them. This is because the first envelope is always drawn from $\begin{array} { r } { U ( 0 , \frac { 2 } { n } ) } \end{array}$ , meaning that it has a fixed maximum amount t.The last envelope, however, is the remaining amount after all previous draws. If the previous envelopes are relatively low, the last envelope can be substantially larger, even approaching the entire amount. Thus, the last participant has no fixed upper bound and is the only one who can take the most advantage ofa “long-tail’ effect. Allintermediate participants’ distributions are constrained by both ends and do not usually reach the extremes. Therefore, the problem can be reduced to only comparing the probability of receiving the highest amount for the first and last participants at different $n$

# 2.4 Qualitative Analysis and Hypothesis

As the number of participants $n$ increases, the fixed upper bound for early envelopes $\frac { 2 } { n }$ becomes smaller. Conversely, the possibility that the leftover amount of the last envelope is exceptionally high increases because there are more opportunities for early draws to be low. Intuitively,the more people there are,the more likely that the last opener benefits from very low previous draws. Therefore, the probability of the last participant receiving the highest amount among all participants can be seen as a monotonically increasing function as the number of participants $n$ increases,and at some point, this probability will exceed the probability of the first participant receiving the highest. Thus, it is hypothesized that as $n$ increases, there exists a positive integer $n$ , the critical position such that for all $n \geq n ^ { \prime }$ , the last participant $( i = n )$ will always be the optimal selection to maximize the winning chance, while for $n < n$ , the first participant $( i = 1 )$ ）will be the optimal choice.

# 2.5 Logarithmic Transformation and Approximate Normality

Instead of dealing with each $X _ { _ i }$ directly, we analyze it in terms of the proportion of the remaining balance to ensure the distribution of the amount each participant receives is independent of each other as it will be only in terms of $n$ and $i$

For $i \geq 2$ ,define

$$
\begin{array} { r } { u _ { i } = \frac { X _ { i } } { R _ { i - 1 } } . } \end{array}
$$

Given that $\begin{array} { r } { X _ { \dotsc } \sim U ( 0 , \frac { 2 R _ { i - 1 } } { n - i + 1 } ) } \end{array}$ ， we can rewrite $u _ { \dot { \iota } } .$

$$
\begin{array} { r } { u _ { i } \sim U ( \frac { 0 } { R _ { i - 1 } } , \frac { 2 R _ { i - 1 } } { ( n - i + 1 ) R _ { i - 1 } } ) } \end{array}
$$

$$
\begin{array} { r } { u _ { i } \sim U ( 0 , \frac { 2 } { n - i + 1 } ) . } \end{array}
$$

Then, the amount of the last envelope can be written as the production of proportion left in all previous envelopes:

$$
X _ { _ n } = \prod _ { i = 1 } ^ { n - 1 } ( 1 - u _ { _ i } )
$$

， where $\boldsymbol { 1 } - \boldsymbol { u } _ { \boldsymbol { i } }$ is the proportion of the balance remaining after the $i$ -th envelope.

To analyze the distribution of $X _ { _ n }$ , we take the logarithm ofthe equation for $X _ { _ n }$ above:

$$
\ln X _ { _ n } = \ln ( \prod _ { i = 1 } ^ { n - 1 } ( 1 - u _ { i } ) ) .
$$

$$
\ln X _ { _ n } = \sum _ { i = 1 } ^ { n - 1 } \ln ( 1 - u _ { _ i } ) .
$$

Let's define the variable $Y$ as the logarithm of $X _ { _ { n } \cdot } \qquad $

$$
Y \equiv \ln X _ { _ n }
$$

$$
Y = \sum _ { i = 1 } ^ { n - 1 } \ln ( 1 - u _ { i } ) .
$$

For small $u _ { { } _ { i } , { } }$ we can use the first-order Taylor series approximation ("Taylor Expansion of $\ln ( 1 - \mathbf { X } ) ^ { \gamma } )$ to simplify $\ln ( 1 - u _ { _ i } )$ ：：

$$
\ln ( 1 - u _ { i } ) \approx - \ u _ { i } .
$$

Thus,

$$
Y \approx - \sum _ { i = 1 } ^ { n - 1 } u _ { i } .
$$

Since $\begin{array} { r } { u _ { i } \sim U ( 0 , \frac { 2 } { n - i + 1 } ) } \end{array}$ follows a uniform distribution, to calculate an expected value we can use the formula:

$$
\begin{array} { r } { E ( X ) = \frac { a + b } { 2 } } \end{array}
$$

,where $X \sim U ( a , b )$ (Numeracy, Maths and Statistics - Academic Skills Kit").

The expected value of $u _ { \phantom { i } i }$ is:

$$
\begin{array} { r } { E ( u _ { i } ) = \frac { 0 + \frac { 2 } { n - i + 1 } } { 2 } } \end{array}
$$

$$
\begin{array} { r } { E ( u _ { i } ) = \frac { 1 } { u - i + 1 } } \end{array}
$$

Thus, we can get the expected value of $Y$ by summing up the expected values of all $u _ { \scriptscriptstyle i } .$

$$
E ( Y ) = - \sum _ { i = 1 } ^ { n - 1 } { \frac { \ d 1 } { n - i + 1 } } .
$$

Given that $H _ { n } = \sum _ { i = 1 } ^ { n } { \frac { 1 } { i } }$ is the $n$ th harmonic number ("Harmonic Number --from Wolfram MathWorld"), the expected value of $Y$ can be rewritten:

$$
E ( Y ) = - \sum _ { i = 2 } ^ { n } { \frac { 1 } { i } }
$$

$$
E ( Y ) = - \ ( \sum _ { i = 1 } ^ { n } { \frac { \ d H } { \ d i } } - 1 )
$$

$$
E ( Y ) = - \ ( H _ { _ { n } } - 1 ) .
$$

To calculate the variance of a uniform distribution $X \sim U ( a , b )$ , the formula is given with ("Numeracy, Maths and Statistics - Academic Skills Kit"):

$$
\begin{array} { r } { V a r ( X ) = \frac { \left( b - a \right) ^ { 2 } } { 1 2 } . } \end{array}
$$

The variance of $u _ { _ i }$ is:

$$
\begin{array} { r } { V a r ( u _ { i } ) = \frac { ( \frac { 2 } { n - i + 1 } - 0 ) ^ { 2 } } { 1 2 } } \end{array}
$$

$$
\begin{array} { r } { V a r ( u _ { i } ) = \frac { \frac { 4 } { ( n - i + 1 ) ^ { 2 } } } { 1 2 } } \end{array}
$$

$$
\begin{array} { r } { V a r ( { u _ { i } } ) = \frac { 1 } { 3 \left( n - i + 1 \right) ^ { 2 } } . } \end{array}
$$

The variance of Y willbe the sum of variance of $u _ { \dot { i } } .$

$$
V a r ( Y ) = \sum _ { i = 2 } ^ { n } \frac { 1 } { 3 \left( n - i + 1 \right) ^ { 2 } }
$$

$$
V a r ( Y ) = \sum _ { i = 2 } ^ { n } { \frac { 1 } { 3 i ^ { 2 } } } .
$$

Let's define $V _ { _ n }$ as the variance of Y:

$$
V _ { n } \equiv V a r ( Y )
$$

$$
V _ { n } = \sum _ { i = 2 } ^ { n } { \frac { 1 } { 3 i ^ { 2 } } }
$$

Since $Y$ is composed of a large number of small and independent terms $u _ { i ^ { , } }$ the Central Limit Theorem supports approximating $Y$ as normally distributed. According to the theorem, when a sum involves many terms with finite means and variances, the overall distribution of the sum tends to become normal, even if the individual terms are not normally distributed (Turney). In this case, as the number of participants increases, the sum of the $u _ { _ i }$ terms becomes more likely to follow a normal distribution. Therefore, $Y$ is appropriate to be treated as approximately normally distributed:

$$
Y \sim N ( E ( Y ) , V a r ( Y ) ) .
$$

$$
Y \sim N ( - \ ( H _ { _ n } - 1 ) , V _ { _ n } ) .
$$

Since $Y = \ln X _ { _ n }$ follows a normal distribution, we can approximate the probability of $X _ { _ { n } }$ being greater than a given value using the normal approximation for log-transformed tail probability. That is, for a random variable $X$ ,which ln $X$ is normally distributed with mean $\mu$ and standard deviation $\sigma$ ,the probability of $X$ being greater than a certain value $x$ for any $x > 0$ can be calculated using the cumulative distribution function $\Phi$ ("Log-normal distribution"):

$$
\begin{array} { r } { P ( X > x ) = 1 - \Phi ( \frac { \ln x - \mu } { \sigma } ) } \end{array}
$$

Substitute $E ( Y ) = - \ ( H _ { _ { n } } - 1 )$ for the mean $\mu$ and ${ \sqrt { V a r ( Y ) } } = { \sqrt { V _ { n } } }$ for the standard deviation o , we obtain the the right-tail probability formula for the last envelope $X _ { _ n }$ being greater than $x$

$$
\begin{array} { r } { P ( X _ { _ n } > x ) = 1 - \Phi ( \frac { \ln x + ( H _ { _ n } - 1 ) } { \sqrt { V _ { _ n } } } ) . } \end{array}
$$

# 2.6 Extreme Values Comparison and Critical Position Calculation

Since $X _ { _ 1 }$ is bounded above by

$$
\begin{array} { r } { X _ { 1 } \leq \frac { 2 } { n } , } \end{array}
$$

$X _ { _ { n } }$ will be the maximum value among all envelopes if

$$
\begin{array} { r } { X _ { n } \geq \frac { 2 } { n } . } \end{array}
$$

Thus, the probability for the $n$ th participant to receive the highest amount is given with:

$$
P ( X _ { n } = m a x ( X _ { 1 } , \cdots , X _ { n } ) ) = P ( X _ { n } > { \frac { 2 } { n } } )
$$

$$
P ( X _ { _ n } = m a x ( X _ { _ 1 } , \cdots , X _ { n } ) ) = 1 - \Phi ( \frac { \ln ( 2 / n ) + ( H _ { _ n } - 1 ) } { \sqrt { V ( n ) } } ) .
$$

For the first envelope, since $X _ { _ 1 }$ is uniformly distributed on the range $[ 0 , \frac { 2 } { n } ]$ , it“wins”only when it is near its maximum.Define“winning”for $X _ { _ 1 }$ as:

$$
\begin{array} { r } { X _ { 1 } > ( 1 - \varepsilon ) \frac { 2 } { n } , } \end{array}
$$

where ε in this case is a fraction of the upper tail of the first envelope's distribution. Whenever $X _ { _ 1 }$ exceeds the fraction threshold 1 - ε, it is considered sufficiently high to be a strong contender for the largest amount. Thus,

$$
\begin{array} { r } { P ( X _ { \mathfrak { \mathrm { ~ 1 ~ } } } ^ { } > ( 1 \mathrm { ~ - ~ } \mathfrak { s } ) \frac { \mathfrak { 2 } } { \mathfrak { n } } ) = \mathfrak { \varepsilon } } \end{array}
$$

$$
P ( X _ { 1 } = m a x ( X _ { 1 } , \cdots , X _ { n } ) ) = \mathfrak { \varepsilon }
$$

The threshold ε willbe selected using a heuristic approach. A reasonable choice is $\varepsilon = 0 . 2$ ， meaning that we consider the top $20 \%$ of the first envelope's possible values as sufficiently high to compete for the largest amount. This selection balances capturing genuinely extreme values while maintaining statistical significance, ensuring the analysis remains both meaningful and applicable. Therefore,

$$
P ( X _ { \ L _ { 1 } } = m a x ( X _ { \ L _ { 1 } } , \xrightarrow { \ L } , X _ { \ L _ { n } } ) ) = 0 . 2 .
$$

We then can set the critical position $n$ for when the probability that the last envelope and the

first envelope of winning meet each other:

$$
P ( X _ { _ { n ^ { * } } } = m a x ( X _ { _ { 1 } } , \cdots , X _ { _ { n ^ { * } } } ) ) = P ( X _ { _ { 1 } } = m a x ( X _ { _ { 1 } } , \cdots , X _ { _ { n ^ { * } } } ) )
$$

That is:

$$
\begin{array} { r } { 1 - \Phi ( \frac { \ln ( 2 / n ^ { * } ) + ( H _ { n ^ { * } } - 1 ) } { \sqrt { V _ { n ^ { * } } } } ) = 0 . 2 . } \end{array}
$$

$$
\begin{array} { r } { \Phi ( \frac { \ln ( 2 / n ^ { * } ) + ( H _ { n ^ { * } } - 1 ) } { \sqrt { V _ { n ^ { * } } } } ) = 0 . 8 . } \end{array}
$$

Let's define the function $z ( n ^ { ^ { * } } )$ as:

$$
\begin{array} { r } { z ( n ^ { * } ) = \frac { \ln ( 2 / n ^ { * } ) + ( H _ { n ^ { * } } - 1 ) } { \sqrt { V ( n ^ { * } ) } } , } \end{array}
$$

$$
\Phi ( z ( n ^ { ' } ) ) = 0 . 8
$$

From the standard normal table (Appendix A), $\Phi ( 0 . 8 4 ) \approx 0 . 8 $ , so the equation becomes:

$$
z ( n ^ { ' } ) \approx 0 . 8 4
$$

Using Mathematica (Appendix B), values of the function $z ( n )$ for $n$ from 2 to 10 are calculated:

<table><tr><td>Value of n</td><td>Value of z(n)</td></tr><tr><td>2</td><td>1.73205</td></tr><tr><td>3</td><td>1.23325</td></tr><tr><td>4</td><td>1.03836</td></tr><tr><td>5</td><td>0.933685</td></tr><tr><td>6</td><td>0.868229</td></tr><tr><td>7</td><td>0.8234</td></tr><tr><td>8</td><td>0.790765</td></tr><tr><td>9</td><td>0.76594</td></tr><tr><td>10</td><td>0.74642</td></tr></table>

Table 2: Values of the function $z ( n )$ for $n$ from 2 to 10   

From Table 2, it is found that $n ^ { ^ { * } } = 7$ as $z ( 7 ) \geq 0 . 8 4$ and $z ( 6 ) < 0 . 8 4$

# 3 Computer Simulation

To validate the theoretical findings,a Python simulation with the following steps is implemented (Appendix C):

1. For each $n$ from 2 to 10, simulate the red envelope spliting process 100000 times. 2. Record which participant obtains the maximum envelope in each trial. 3. Generate bar charts to show the frequency of receiving the highest amount for each participant.

Using the Python program, 9 bar charts of $n$ from 2 to 10 are generated to show the frequency of receiving the highest amount for each participant $i$ of $i$ from 1 to $n$ . The graphs for $n = 7$ and $n = 8$ are presented below:

![](images/ddf8e4adf1cfd64e760c23cae33901893a6988b2b9cb80e12b6ce0a11b80f9c6.jpg)  
Distribution of the Luckiest Participant in WeChat Red Envelopes (100000 Trials,7 Participants)   
Figure 1: Frequency distribution of the luckiest participant in WeChat red envelopes with

100,000 trials and 7 participants

![](images/7f7d2f7e7eed7cb4a736b272b97db67d89789bee83bc8bbd832abcc54b0f4980.jpg)

Figure 2: Frequency distribution of the luckiest participant in WeChat red envelopes with 100,000 trials and 8 participants

From Figure 1, simulation results indicate that for smaller $n$ $( n < 8 )$ , the first participant wins most frequently. However, from Figure 2, when $n \geq 8$ , the last participant’s winning frequency exceeds that of the first. This suggests that the actual $n \stackrel { \cdot } { = } 8$ ,which is close to the 7 we found using calculations.

# 4 Conclusion, Evaluations, and Future Works

In conclusion, our model shows that early participants are constrained by a fixed upper boundary, whereas later participants benefit from a long-tail effect. The qualitative analysis suggests that as $n$ increases, this long-tail effect contributes more to the amounts received by later participants and becomes increasingly important. As a result, the strategy to maximize the chance of receiving the highest amount is that when the number of participants is below the critical position $n$ , participants should open the envelope as early as possible. Conversely, when the number of participants is greater than or equal to the critical position, participants should open the envelope as late as possible to maximize their chance of winning. Based on theoretical calculations and reasonable assumptions, we determined this critical position to be $n ^ { * } = 7$ The computer simulations validated this result by showing that the actual value is only slightly higher at $n ^ { ^ { * } } = 8$

Overall, this IA has successfully modeled the WeChat red envelope mechanism under the double-average method and analyzed how the opening order affects the probability of receiving the largest envelope. There are both strengths and weaknesses in the exploration. One strength o the exploration is that both qualitative and quantitative analyses have been used. The qualitative analysis part allows the general direction of the problem-solving approach to be confirmed, makes the results more accessble to a wider audience, and most importantly, largely reduces the problem to only comparing the first and last envelope. The other strength of the exploration is that the result from the theoretical calculation is validated and confirmed by computer simulations, which gives a quite precise and close answer. Furthermore, in the final step of solving the equation for the function $z ( n )$ , instead of relying on a purely algebraic method, which requires integral approximation of sums that could introduce uncertainties, this exploration used numeral table generation using Mathematica to find the critical position $n$ ： While this method takes more computational effort, it can reduce the uncertainty to the greatest extent. A possble future work is to use this alternative approach of integral approximation to solve for the critical position instead of using numeral table generation. However, on the other hand, there are also some weaknesses and limitations in the method used in this exploration. While the use of first-order Taylor expansion $\ln ( 1 - u _ { i } ) \approx - \ u _ { i }$ can simplify the calculation, it might also introduce errors when $u _ { _ i }$ is relatively large. To improve this, a higher-order approximation can be used. Also, the Central Limit Theorem approximation used assumes that the sum of $\ln ( 1 - u _ { _ i } )$ is normally distributed. However, for small $n$ ,deviations from normality may exist. Another future work could be analyzing the joint distribution of all envelopes. Additionally, the definition of“winning” for the first envelope (being in the top $20 \%$ was somewhat arbitrary. Realistically this threshold would be changed at different $n$ ,which this exploration ignored,and a different threshold could slightly affect the critical position $n$ .A

deeper analysis of the selection of this threshold value might be required. Future work could analyze how varying this threshold affects the transition point at which the last participant overtakes the first.

# 5 Works Cited

“Harmonic Number -- from Wolfram MathWorld.” Wolfram MathWorld, https://mathworld.wolfram.com/HarmonicNumber.html. Accessed 17 February 2025.   
"Log-normal distribution.” Wikipedia, https://en.wikipedia.org/wiki/Log-normal_distribution. Accessed 17 February 2025.

"Numeracy, Maths and Statistics - Academic Skills Kit.” Numeracy, Maths and Statistics - Academic Skills Kit, https://www.ncl.ac.uk/webtemplate/ask-assets/external/maths-resources/business/probabi ity/uniform-distribution.html. Accessed 17 February 2025.

“STANDARD NORMAL DISTRIBUTION: Table Values Represent AREA to the LEFT of the Z score.” Arizona Math, htps://math.arizona.edu/\~rsims/ma464/standardnormaltable.pdf. Accessed 18 February 2025.

“Taylor Expansion of In(1-x).” Wolfram Alpha, Wolfram Research, https://www.wolframalpha.com/input?i $\circleddash$ taylor+expansion+of+ln%281-x%29. Accessed 17 2 2025.

Tim.“微信红包金额分配的算法["WeChat Red Envelope Amount Allocation Algorithm"]." timyang, 30 4 2015, htps:/timyang.net/architecture/wechat-red-packet/. Accessed 16 2 2025.

Turney, Shaun.“Central Limit Theorem |Formula, Definition & Examples.” Scribbr, 6 July 2022, htps://www.scribbr.com/statistics/central-limit-theorem/. Accessed 17 February 2025.

“WeChat red envelope.” Wikipedia, htps://en.wikipedia.org/wiki/WeChat_red_envelope. Accessed 23 February 2025.