import os
import torch
import sys
from core.nets.resnet import resnet

# 加载 pth
net = resnet()  # 实例化你的模型

script_dir = os.path.dirname(os.path.abspath(__file__))
core_dir = os.path.dirname(script_dir)
model_dir = os.path.join(core_dir, "models")

net.load_state_dict(torch.load(os.path.join(model_dir, "resnet_epoch_100.pth"), map_location="cpu"))
net.eval()

# 导出 ONNX
dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    net,
    dummy_input,
    os.path.join(model_dir, "resnet_epoch_100.onnx"),
    export_params=True,
    opset_version=11,
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}}
)
