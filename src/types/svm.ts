/****
 * IKernel
 */
export interface IKernel {
  run(x: number[], y: number[]): number
}

export interface IInteractableKernel {
  getAttributes(): string[]
  getAttribute(name: string): IKernelProperty
  getAttributeType(name: string): string
  getAttributeBy(property: string): Record<string, any>
}

export interface IKernelProperty extends PropertyDescriptor {
  type: string
  name?: string
}

export interface IKernelPropertyMap extends PropertyDescriptorMap {
  [s: string]: IKernelProperty
}

export interface IEstimable {
  // Estimates kernel parameters from the data
  estimate<T>(inputs: Array<T>[]): void
}

export interface IDistance {
  /**
   * Computes the distance in input space
   * between two points given in feature space.
   * @param x Vector x in feature (kernel) space.
   * @param y Vector y in feature (kernel) space.
   * @return number Distance between x and y in input space.
   */
  distance(x: number[], y: number[]): number
}

/*******
 * ISupportVectorMachine
 */

export interface ISupportVectorMachine {
  /**
   * Computes the given input to produce the corresponding output.
   * @param inputs An input vector.
   * @param output The output for the given input.
   * @returns number The decision label for the given input.
   */
  compute(inputs: number[]): number
  compute(inputs: number[], output: number): number

  getKernel(): IKernel

  getInputCount(): number

  getSupportVectors(): number[][]
  setSupportVectors(supportVectors: number[][]): void
  setSupportVector(index: number, supportVector: number[]): void
  getSupportVector(index: number): number[]

  getWeights(): number[]
  getWeight(index: number): number
  setWeights(weights: number[]): void
  setWeight(index: number, value: number): void

  setThreshold(bias: number): void
  getThreshold(): number
}

export interface ISVM {
  getWidth(): number
  setWidth(value: number)

  getHeight(): number
  setHeight(value: number)

  getDensity(): number
  setDensity(value: number)

  getScale(): number
  setScale(value: number)

  setTeacher(teacher: ISupportVectorMachineLearning): ISVM

  setKernel(kernel: IKernel): ISVM
  getKernel(): IKernel

  setKernelProperties(properties: IKernelProperty[]): ISVM
  setKernelProperty(name: string, value: any): ISVM

  train(inputs: number[], labels: number[]): number[][]
  retrain(): ISVM

  setRenderer(renderer: IRenderer): ISVM
  render(): IRenderer
}

/************
 * ISupportVectorMachineLearning
 */

export interface ISupportVectorMachineLearning {
  machine: ISupportVectorMachine
  alphaA: Float64Array
  alphaB: Float64Array
  errors: Float64Array
  inputs: number[][]
  outputs: number[]
  biasLower: number
  biasUpper: number
  kernel: IKernel

  run(computeError?: boolean): number
  getComplexity(): number
  setComplexity(c: number): void
}

/************
 * IRenderer
 */
export interface IRenderer {
  teacher: ISupportVectorMachineLearning

  render(): IRenderer
  drawStatus(): IRenderer
  drawCircle(x: number, y: number, r: number): IRenderer
  drawRect(x: number, y: number, w: number, h: number): IRenderer
  drawBubble(x: number, y: number, w: number, h: number, radius: number): IRenderer
  drawDataPoints(): IRenderer
}

export interface ICanvasRenderer extends IRenderer {
  drawBackground(matrix: number[][], color: string): ICanvasRenderer
  drawAxis(): ICanvasRenderer
  drawMargin(): ICanvasRenderer
  clearCanvas(): ICanvasRenderer
}

export interface IVideoRenderer extends IRenderer {
  snapShot(): Blob
  trace(): void
}
