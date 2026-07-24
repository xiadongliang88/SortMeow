mode = "toy"

"""
epoch       训练多少轮
lr          学习率
batch_size  一轮跑多少张图片
input_size  训练图片输入尺寸
label_name  分类
"""

if mode == "toy":
    epoch = 15
    lr = 2e-4
    batch_size = 2
    input_size = 224

    # 分类
    label_name = [
        "american_shorthair",
        "bengal",
        "british_shorthair",
        "exotic_shorthair",
        "maine_coon",
        "ragdoll",
        "sphynx",
    ]
    num_classes = len(label_name)
elif mode == "benchmark":
    epoch = 15
    lr = 2e-4
    batch_size = 2
    input_size = 224

    # 分类
    label_name = [
        "american_shorthair",
        "bengal",
        "british_shorthair",
        "exotic_shorthair",
        "maine_coon",
        "ragdoll",
        "sphynx",
    ]
    num_classes = len(label_name)