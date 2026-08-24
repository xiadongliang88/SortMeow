mode = "benchmark"

"""
epoch       训练多少轮
lr          学习率
batch_size  一轮跑多少张图片
input_size  训练图片输入尺寸
label_name  分类
"""

if mode == "toy":
    epoch = 100
    lr = 5e-4
    batch_size = 8
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
    epoch = 50  # resnet=80, resnet18=50, convnext=100
    lr = 1e-4  # resnet, resnet18=1e-4
    weight_decay = 1e-4  # resnet=1e-3, resnet18=1e-4
    batch_size = 8
    input_size = 224

    # 分类
    label_name = [
        "american_shorthair",  # 美国短毛猫
        "british_shorthair",  # 英国短毛猫
        "ragdoll",  # 布偶猫
        "exotic_shorthair",  # 异国短毛猫
        "maine_coon",  # 缅因猫
        "siamese",  # 暹罗猫
        "sphynx",  # 斯芬克斯猫
        "turkish_van",  # 土耳其梵猫
        "bengal",  # 孟加拉豹猫
        "scottish_fold",  # 苏格兰折耳猫
        "none",  # 风景人物
        "other",  # 其他动物
    ]
    num_classes = len(label_name)