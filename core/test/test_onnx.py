import os
import cv2
import glob
import torch
import numpy as np
from PIL import Image
import onnxruntime as ort
from torchvision import transforms
from core.const import mode, label_name, input_size


def test():
    providers = ['CUDAExecutionProvider', 'CPUExecutionProvider'] if 'CUDAExecutionProvider' in ort.get_available_providers() else ['CPUExecutionProvider']
    print(f"使用设备: {providers[0]}")

    script_dir = os.path.dirname(os.path.abspath(__file__))
    core_dir = os.path.dirname(script_dir)
    model_dir = os.path.join(core_dir, "models")
    dataset_dir = os.path.join(core_dir, "dataset", mode, "test")

    # 加载ONNX模型
    session = ort.InferenceSession(os.path.join(model_dir, "resnet_epoch_100.onnx"), providers=providers)

    # 获取输入名称（用于后续推理时指定输入）
    input_name = session.get_inputs()[0].name

    im_list = glob.glob(os.path.join(dataset_dir, "*", "*.jpg"))
    np.random.shuffle(im_list)

    # 预处理
    test_transform = transforms.Compose([
        transforms.Resize(input_size),
        transforms.CenterCrop(input_size),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    for im_path in im_list:
        im_data = Image.open(im_path)

        inputs = test_transform(im_data)
        inputs = torch.unsqueeze(inputs, dim=0)  # 这里还在用torch，下面会改

        # 将输入转为numpy，ONNX Runtime需要numpy输入
        inputs = inputs.numpy()
        if providers[0] == 'CPUExecutionProvider':
            inputs = inputs.astype(np.float32)

        # ONNX Runtime推理，输出直接是numpy数组
        outputs = session.run(None, {input_name: inputs})[0]

        # 解析结果，直接用numpy操作
        pred = np.argmax(outputs, axis=1)
        print(label_name[pred[0]], " ", im_path)

        img = np.asarray(im_data)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        img = cv2.resize(img, (200, int(img.shape[0] * 200 / img.shape[1])))
        cv2.imshow("img", img)
        cv2.waitKey(0)


if __name__ == "__main__":
    test()