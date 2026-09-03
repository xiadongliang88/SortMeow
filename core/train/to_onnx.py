import os
import torch
from core.nets.resnet18 import resnet18

# 加载 pth
net = resnet18()


script_dir = os.path.dirname(os.path.abspath(__file__))
core_dir = os.path.dirname(script_dir)
model_dir = os.path.join(core_dir, "models")


net.load_state_dict(torch.load(os.path.join(model_dir, "resnet18_epoch_50.pth"), map_location="cpu"))
net.eval()


# 导出 ONNX
dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    net,
    dummy_input,
    os.path.join(model_dir, "resnet18_epoch_50.onnx"),
    export_params=True,
    opset_version=11,
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}}
)
